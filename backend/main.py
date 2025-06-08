import os, traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import HTTPException


import google.generativeai as genai
from settings import *


from dotenv import load_dotenv
# Load env vars
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# model = genai.GenerativeModel("gemini-1.5-flash")
# list of models
# gemini-2.5-pro-preview-03-25
# gemini-2.0-flash
# gemini-2.0-flash-lite
# gemini-1.5-flash

model = genai.GenerativeModel("gemini-2.0-flash")


# App init
app = FastAPI()
# “I’m starting my backend server here. All routes, middleware, etc. will be added to this app.”



# CORS setup so React frontend can access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# This defines the expected JSON structure for a POST request to your /ask endpoint.
# Request model
class AskRequest(BaseModel):
    session_id: str
    question: str
    language:str
# {
#   "question": "What are my rights in a bank?"
# }
        #  FastAPI will:
# Automatically parse this JSON

# Validate that question is a string

# Throw an error if it's missing or invalid

# Bind it to the request parameter in the route



# Store session-wise chat objects (you can extend with UUID/user-id later)
chat_sessions = {}


system_instruction = (
    "You are LexiBot, a helpful legal assistant built to answer legal questions accurately "
    "and concisely in a structured format. Always break answers into:\n"
    "1. Information\n2. Legal Consequences\n3. What the user should do\n"
    "You must not give false or misleading legal advice. If unsure, suggest consulting a lawyer."
)


@app.post("/ask")
# Creates a POST API route at /ask (access via http://localhost:8000/ask)
def ask_lexibot(request: AskRequest):
    try:
        session_id = request.session_id
        language = request.language
        print("======================================language",language)

        # formatted_question = (
        #     request.question +
        #     "\n\nPlease answer in points:\n1. Information\n2. Legal Consequences\n3. Suggested Action"
        # )
        # formatted_question = (
        #     request.question +
        #     "\n\nPlease answer in the following format in (language " + language + "):\n\n"
        #     "**1. Information:**\n- ...\n\n"
        #     "**2. Legal Consequences:**\n- ...\n\n"
        #     "**3. Suggested Actions:**\n- ...\n\n"
        #     "**4. What if you...?**\n- Explain how to handle or avoid this legally.\n\n"
        #     "***5.Also provide the offcial site for the complaint related to it.\n"
        #     "Use bullet points or subheadings if needed. Be precise and avoid unnecessary detail.Each point should come in new line"
        # )
        formatted_question = (
            request.question +
            f"\n\nPlease answer in the following format in language ({language}):\n\n"
            "### 1. Information\n"
            "- ...\n\n"
            "### 2. Legal Consequences\n"
            "- ...\n\n"
            "### 3. Suggested Actions\n"
            "- ...\n\n"
            "### 4. What if you...?\n"
            "- Provide explanations for edge cases or exceptions.\n\n"
            "### 5. Official Sites for Complaints\n"
            "- Include clickable links using Markdown like this: [FSSAI Website](https://www.fssai.gov.in/)\n\n"
            "**Formatting rules:**\n"
            "- Use bullet points for clarity\n"
            "- Use headings for each section\n"
            "- Keep language precise and avoid unnecessary details\n"
            "- Each bullet point should be on a new line\n"
        )


        # Initialize session if not present
        if session_id not in chat_sessions:
            system_prompt = (
                "You are LexiBot, a legal assistant AI. Always respond with concise, structured legal information. "
                "Break responses into: Information, Consequences, Suggested Actions. Don't guess."
                "Add response: with heading 'what if you' , tell approach how to get rid of. "
            )
            chat_sessions[session_id] = model.start_chat(history=[
                {"role": "model", "parts": [system_prompt]},
                {"role": "user", "parts": ["Hi"]},
                {"role": "model", "parts": ["Hello! I’m LexiBot. What legal question can I help with today?"]}
            ])

        # Chat
        chat = chat_sessions[session_id]
        response = chat.send_message(formatted_question)
        return {"answer": response.text}

    except Exception as e:
        logging.error("Error in ask_lexibot: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again later.")








# def ask_lexibot_(request: AskRequest):#This function handles the request. FastAPI automatically reads and validates the body into this request
#     try:
#         print("question")
#         question = request.question
#         model = genai.GenerativeModel("gemini-1.5-flash")
#         response = model.generate_content(question + " please give me the answer in points like information , then consequences then ")
#         answer = response.text
#         return answer
#     except Exception as e:
#         print(e)
#         logging.error("Error in ask_lexibot: %s", traceback.format_exc())
#         raise HTTPException(status_code=500, detail="Something went wrong. Please try again later.")

