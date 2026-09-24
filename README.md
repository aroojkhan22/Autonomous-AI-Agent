# Autonomous AI Agent

A $0-cost autonomous AI research/report agent built with React, Framer Motion, FastAPI, LangGraph, DuckDuckGo, and Ollama.

## Requirements
- Windows
- Python 3.11+ (your Python 3.14 may work, but if a package fails, use Python 3.12)
- Node.js 20+
- Ollama

## Setup

1. Install Ollama from https://ollama.com/download/windows
2. Pull the local model:

```bat
ollama pull qwen2.5:3b
```

3. Open a terminal in this project and run:

```bat
start.bat
```

The frontend opens at http://localhost:5173 and the API runs at http://localhost:8000.

## What it does
Enter a research task. The agent:
- plans the task
- searches the web using DuckDuckGo
- summarizes findings with the local Ollama model
- creates a report
- streams high-level progress to the UI

No paid API key is required.
