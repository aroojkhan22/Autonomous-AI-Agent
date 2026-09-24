from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_ollama import ChatOllama
from langchain_community.tools import DuckDuckGoSearchRun

class AgentState(TypedDict, total=False):
    task: str
    plan: str
    research: str
    report: str
    status: list

llm = ChatOllama(model="qwen2.5:0.5b", temperature=0.2)
search = DuckDuckGoSearchRun()

def plan_node(state: AgentState):
    task = state["task"]
    prompt = f"""Create a concise research plan for this task:
{task}

Return 3 to 5 concrete research steps. Do not expose hidden chain-of-thought."""
    result = llm.invoke(prompt)
    return {
        "plan": result.content,
        "status": state.get("status", []) + ["Planner completed"]
    }

def research_node(state: AgentState):
    task = state["task"]
    try:
        query = f"{task} latest reliable information"
        results = search.invoke(query)
    except Exception as e:
        results = f"Search unavailable: {e}"
    return {
        "research": str(results)[:12000],
        "status": state.get("status", []) + ["Web research completed"]
    }

def report_node(state: AgentState):
    prompt = f"""Write a useful professional report for the user's task.

Task:
{state['task']}

Research:
{state.get('research','')}

Plan:
{state.get('plan','')}

Include:
- Executive summary
- Key findings
- Important details
- Sources/search references when present
- Practical conclusion

Do not claim facts that are unsupported by the research."""
    result = llm.invoke(prompt)
    return {
        "report": result.content,
        "status": state.get("status", []) + ["Report completed"]
    }

builder = StateGraph(AgentState)
builder.add_node("planner", plan_node)
builder.add_node("research", research_node)
builder.add_node("report", report_node)
builder.add_edge(START, "planner")
builder.add_edge("planner", "research")
builder.add_edge("research", "report")
builder.add_edge("report", END)
graph = builder.compile()

def run_agent(task: str):
    final = graph.invoke({"task": task, "status": []})
    return {
        "task": task,
        "plan": final.get("plan", ""),
        "research": final.get("research", ""),
        "report": final.get("report", ""),
        "status": final.get("status", [])
    }
