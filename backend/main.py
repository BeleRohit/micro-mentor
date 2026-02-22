from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow Chrome extension to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MentorRequest(BaseModel):
    text: str

@app.post("/mentor")
def mentor(req: MentorRequest):
    # For now: dummy Socratic question
    return {
        "question": "What assumption is hidden inside this statement?"
    }