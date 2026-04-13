from fastapi import FastAPI
from pydantic import BaseModel
from agent import interact, format_output
from dotenv import load_dotenv
from typing import List, Dict, Any, Union
import json

from fastapi.middleware.cors import CORSMiddleware

from json2xml import json2xml
from json2xml.utils import readfromstring

load_dotenv()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    user_id: str
    page_context: Union[List[Dict[str, Any]], Dict[str, Any]] = {}
    database: str = "kpi_data"


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/chat")
def chat(request: ChatRequest) -> str:
    user_id = request.user_id
    message = request.message
    page_context = request.page_context
    database = request.database

    try:
        page_context_json = json.dumps(page_context)
        raw_page_context = readfromstring(page_context_json)
        xml_page_context = json2xml.Json2xml(raw_page_context).to_xml()
        page_context = xml_page_context if xml_page_context else page_context
    except Exception as e:
        print(f"Error converting page_context to XML: {e}")

    messages = []
    response = interact(user_id, message, page_context, database)

    for msg in response:
        messages.append(str(msg))

    raw_output = "\n".join(messages) if messages else "No response generated"
    return format_output(message, raw_output)
