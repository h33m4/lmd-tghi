import warnings
warnings.filterwarnings("ignore", message="pkg_resources is deprecated")

from langchain.tools import BaseTool
from langchain_aws import ChatBedrockConverse
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import AIMessage, ToolMessage
from sqlalchemy import create_engine
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_message
import os
from dotenv import load_dotenv

import json
from datetime import datetime
import pandas as pd

from langgraph.checkpoint.postgres import PostgresSaver

load_dotenv()

DB_URI = os.getenv("DB_URI")
MEM_DB_URI = os.getenv("MEM_DB_URI")
MODEL_ID = os.getenv("MODEL_ID", "us.anthropic.claude-sonnet-4-20250514-v1:0")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

THREAD_VERSION = "v3"


class ConnectorXTool(BaseTool):
    name: str = "connectorx_data_retriever"
    description: str = (
        f"Current time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}. "
        "Useful for retrieving data from various sources using ConnectorX. "
        "Input should be a SQL query string. The connection string is automatically provided."
        "Tables for Malawi kpis begin with mlw_"
        "Tables for Liberia kpis begin with lib_"
        "Tables for Ethiopia kpis begin with eth_"
        "Tables for Sierra Leone kpis begin with sl_"
        "Tables for Global Scale kpis begin with gs_"
    )

    def __init__(self, db_uri: str, **kwargs):
        super().__init__(**kwargs)
        self._db_uri = db_uri

    def _run(self, query: str) -> str:
        print(f"Executing query: {query}")
        try:
            engine = create_engine(self._db_uri)
            with engine.connect() as conn:
                df = pd.read_sql(query, conn.connection)

            print(f"Query successful, returned {len(df)} rows")

            if "table_name" in df.columns:
                print("Tables found:")
                for name in df["table_name"].tolist():
                    print(f"  - {name}")

            return json.dumps({
                "status": "success",
                "rows": df.astype(str).to_dict(orient="records")
            })

        except Exception as e:
            print(f"Query failed with error: {str(e)}")
            return json.dumps({
                "status": "error",
                "error": str(e),
                "query": query
            })


class ContextTool(BaseTool):
    name: str = "context_retriever"
    description: str = (
        "Retrieves context data provided by the user to answer questions."
    )

    def __init__(self, page_context: dict = None, **kwargs):
        super().__init__(**kwargs)
        self._page_context = page_context or {}

    def _run(self, query: str = "") -> str:
        return json.dumps(self._page_context)

    async def _arun(self, query: str = "") -> str:
        return self._run(query)


def sanitize_message_history(messages: list) -> list:
    """
    For any AIMessage with unresolved tool_calls, inject a synthetic ToolMessage
    immediately after it. Tracks injected IDs to avoid double-injecting.
    """
    responded_tool_ids = {
        msg.tool_call_id
        for msg in messages
        if isinstance(msg, ToolMessage)
    }

    patched = []
    injected_ids = set()

    for msg in messages:
        patched.append(msg)
        if isinstance(msg, AIMessage) and msg.tool_calls:
            for tc in msg.tool_calls:
                if tc["id"] not in responded_tool_ids and tc["id"] not in injected_ids:
                    patched.append(ToolMessage(
                        tool_call_id=tc["id"],
                        content="Tool call was interrupted and did not complete. Please retry.",
                        name=tc["name"],
                    ))
                    injected_ids.add(tc["id"])
                    print(f"Injected synthetic ToolMessage for dangling call: {tc['name']} ({tc['id']})")

    return patched


@retry(
    wait=wait_exponential(multiplier=2, min=4, max=60),
    stop=stop_after_attempt(4),
    retry=retry_if_exception_message(match=".*ThrottlingException.*"),
    reraise=True,
)
def _stream_agent(agent, messages, config):
    """Wrap agent.stream with throttling retry logic."""
    result = None
    for step in agent.stream(
        {"messages": messages},
        config=config,
        stream_mode="values",
    ):
        result = step
    return result


def interact(
    user_id: str, message: str, page_context: dict = None, database: str = "kpi_data"
):
    try:
        llm = ChatBedrockConverse(model_id=MODEL_ID, region_name=AWS_REGION)

        connectorx_tool = ConnectorXTool(DB_URI)
        context_tool = ContextTool(page_context)
        tools = [connectorx_tool, context_tool]

        context_info = (
            " When user asks about current context, data, or content, FIRST use 'context_retriever' tool and prioritize that data. Only use database queries as supplementary information if specifically requested."
            if page_context
            else ""
        )

        system_message = (
            f"You are a data analyst assistant that retrieves KPI data from a database.{context_info} "
            "STRICT RULES:\n"
            "1. Use 'connectorx_data_retriever' to run SQL queries.\n"
            "2. Run a MAXIMUM of 3 queries per question. Do not explore tables unnecessarily.\n"
            "3. If the first query returns data, answer immediately — do not run more queries unless the data is clearly insufficient.\n"
            "4. If a query fails, try ONE alternative query then answer with what you have.\n"
            "5. Never query the same table twice.\n"
            "6. Do not look up column names before querying — use SELECT * with LIMIT 5 if unsure of schema.\n"
            "7. Once you have data, stop querying and provide your answer.\n"
            "Available table prefixes: mlw_ (Malawi), lib_ (Liberia), eth_ (Ethiopia), sl_ (Sierra Leone), gs_ (Global Scale)."
        )

        # Version suffix ensures broken checkpoints are never reloaded
        config = {"configurable": {"thread_id": f"{user_id}_{THREAD_VERSION}"}}

        with PostgresSaver.from_conn_string(MEM_DB_URI) as memory:
            memory.setup()
            agent = create_react_agent(llm, tools, checkpointer=memory)

            # Load history and patch any dangling tool calls
            state = agent.get_state(config)
            existing_messages = []
            if state and state.values.get("messages"):
                existing_messages = sanitize_message_history(state.values["messages"])

            messages = existing_messages + [
                {"role": "system", "content": system_message},
                {"role": "user", "content": message},
            ]

            result = _stream_agent(agent, messages, config)
            return result["messages"][-1].content

    except Exception as e:
        print(f"Error: {e}")
        return "An error occurred"


def format_output(question: str, raw_data: str) -> str:
    try:
        llm = ChatBedrockConverse(model_id=MODEL_ID, region_name=AWS_REGION)

        prompt = f"""Based on the question: "{question}"

            Format and summarize this data in proper markdown without omitting any important details:

            {raw_data}

            Provide a comprehensive markdown response that:
            1. Uses proper markdown headers (##, ###)
            2. Creates markdown tables for data
            3. Uses bullet points and numbered lists
            4. Do not show technical details like SQL queries, schemas and code blocks
            5. Maintains all numerical precision
            6. Highlights key insights with **bold** text
            7. Be very concise

            Format the entire response as clean, readable markdown."""

        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        return f"**Formatting error:** {e}\n\n```\n{raw_data}\n```"


if __name__ == "__main__":
    print(interact("user1", "select 1 + 1"))