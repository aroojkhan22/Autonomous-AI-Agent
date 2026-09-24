from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent.graph import run_agent

app = FastAPI(title="Autonomous AI Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskRequest(BaseModel):
    task: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/run")
def run(request: TaskRequest):
    if not request.task.strip():
        return {"error": "Task cannot be empty"}
    return run_agent(request.task.strip())
