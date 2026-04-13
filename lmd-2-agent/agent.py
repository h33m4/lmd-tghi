from langchain.tools import BaseTool
from langchain_aws import ChatBedrockConverse
from langgraph.prebuilt import create_react_agent
import connectorx as cx
import os
from dotenv import load_dotenv
import psycopg
import json
from datetime import datetime

from langgraph.checkpoint.postgres import PostgresSaver

load_dotenv()

DB_URI = os.getenv("DB_URI")
MODEL_ID = os.getenv("MODEL_ID", "us.anthropic.claude-sonnet-4-20250514-v1:0")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

# ded


class ConnectorXTool(BaseTool):
    name: str = "connectorx_data_retriever"
    description: str = (
        f"Current time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}. "
        "Useful for retrieving data from various sources using ConnectorX. "
        "Input should be a SQL query string. The connection string is automatically provided."
        "Tables for Malawi kpis begin with mlw_"
        "Tables for Liberia kpis begin with lib_"
        "Tables for Ethiopia kpis begin with eth_"
        "Tables for Sirre Leone kpis begin with sl_"
        "Tables for Global Scale kpis begin with gs_"
        ""
    )

    def __init__(self, db_uri: str, **kwargs):
        super().__init__(**kwargs)
        self._db_uri = db_uri

    def _run(self, query: str) -> str:
        try:
            print(f"Executing query: {query}")
            df = cx.read_sql(self._db_uri, query)
            print(f"Query successful, returned {len(df)} rows")
            return df.to_json(orient="records")
        except Exception as e:
            print(f"Query failed with error: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            return f"Error retrieving data: {e}"

    async def _arun(self, query: str) -> str:
        return self._run(query)


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


class ResponseFormatterTool(BaseTool):
    name: str = "response_formatter"
    description: str = "Formats data and responses into human-readable format with tables and summaries using AI."

    def _run(self, data: str) -> str:
        try:
            llm = ChatBedrockConverse(
                model_id=MODEL_ID,
                region_name=AWS_REGION,
                temperature=0,
            )

            prompt = f"""Format this data into a human-readable summary with key insights:
                Data: {data}
                Please provide:
                1. A brief summary of what the data shows
                2. Key findings or patterns
                3. A clean table format if applicable
                4. Any notable insights
                Keep the response concise and easy to understand."""

            response = llm.invoke(prompt)
            return response.content
        except Exception as e:
            # Fallback to basic formatting
            try:
                parsed_data = json.loads(data)
                if isinstance(parsed_data, list) and len(parsed_data) > 0:
                    headers = list(parsed_data[0].keys())
                    result = f"Found {len(parsed_data)} records:\n\n"
                    result += " | ".join(headers) + "\n"
                    result += "-" * (len(" | ".join(headers))) + "\n"
                    for row in parsed_data[:10]:
                        result += (
                            " | ".join(str(row.get(h, "")) for h in headers) + "\n"
                        )
                    if len(parsed_data) > 10:
                        result += f"\n... and {len(parsed_data) - 10} more records"
                    return result
                return str(data)
            except Exception as e:
                print(f"Error during basic formatting: {e}")
                return str(data)

    async def _arun(self, data: str) -> str:
        return self._run(data)


# Test ConnectorX connection directly
try:
    test_df = cx.read_sql(DB_URI, "SELECT 1 as test")
except Exception as e:
    print(f"ConnectorX test failed: {e}")


def interact(
    user_id: str, message: str, page_context: dict = None, database: str = "kpi_data"
):
    try:
        llm = ChatBedrockConverse(model_id=MODEL_ID, region_name=AWS_REGION)

        conn = psycopg.connect(os.getenv("MEM_DB_URI"), autocommit=True)
        memory = PostgresSaver(conn)

        memory.setup()

        db_uri = DB_URI.rsplit("/", 1)[0] + f"/{database}"

        connectorx_tool = ConnectorXTool(db_uri)
        context_tool = ContextTool(page_context)
        tools = [connectorx_tool, context_tool]
        agent = create_react_agent(llm, tools, checkpointer=memory)

        context_info = (
            " IMPORTANT: When user asks about current context, data, or content, FIRST use 'context_retriever' tool and prioritize that data. Only use database queries as supplementary information if specifically requested."
            if page_context
            else ""
        )
        system_message = f"You are an AI assistant that can answer questions by retrieving data from databases.{context_info} Use 'connectorx_data_retriever' tool with SQL queries only."

        config = {"configurable": {"thread_id": user_id}}

        stream = agent.stream(
            {
                "messages": [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": message},
                ]
            },
            config=config,
            stream_mode="values",
        )

        for step in stream:
            if "messages" in step and step["messages"]:
                yield step["messages"][-1].content

    except Exception as e:
        print(f"Error: {e}")
        yield "An error occurred"


# Add this to agent.py
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
    for response in interact("user1", "select 1 + 1"):
        print(response)
