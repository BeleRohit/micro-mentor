from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set your Groq API key as environment variable
# export GROQ_API_KEY="your_key_here"

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

class MentorRequest(BaseModel):
    text: str

@app.post("/mentor")
def mentor(req: MentorRequest):

    prompt = f"""
You are a Socratic mentor.

Given the following highlighted content,
ask ONE short, probing conceptual question
that helps the learner understand the idea more deeply.

Do NOT explain.
Do NOT answer.
Ask only one question.

Text:
{req.text}
"""

    response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )

    question = response.choices[0].message.content.strip()

    return {"question": question}