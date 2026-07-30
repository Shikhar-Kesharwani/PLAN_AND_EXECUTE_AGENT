from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from graph.state import PlanExecuteState
from graph.nodes import (
    planner_node,
    executor_node,
    replanner_node,
    final_answer_node
)


def should_continue(state: PlanExecuteState) -> str:
    """
    Route after replanner:
    - If complete → compile final answer
    - If more steps → execute next step
    """
    plan = state["plan"]
    idx  = state["current_step_idx"]

    if state.get("is_complete"):
        return "compile"

    if idx >= len(plan.steps):
        return "compile"

    return "execute"


def build_plan_execute_graph():
    """
    Assembles the complete Plan-and-Execute LangGraph
    with MemorySaver for conversation history.
    """
    graph = StateGraph(PlanExecuteState)

    # Register nodes
    graph.add_node("planner",      planner_node)
    graph.add_node("executor",     executor_node)
    graph.add_node("replanner",    replanner_node)
    graph.add_node("final_answer", final_answer_node)

    # Entry point
    graph.set_entry_point("planner")

    # Planner → Executor (always start executing)
    graph.add_edge("planner", "executor")

    # Executor → Replanner (always check after each step)
    graph.add_edge("executor", "replanner")

    # Replanner → conditional routing
    graph.add_conditional_edges(
        "replanner",
        should_continue,
        {
            "execute": "executor",    # more steps to run
            "compile": "final_answer" # we are done
        }
    )

    # Final answer → END
    graph.add_edge("final_answer", END)

    # MemorySaver enables conversation history / checkpointing
    memory = MemorySaver()
    return graph.compile(checkpointer=memory)


# Singleton
PLAN_EXECUTE_GRAPH = build_plan_execute_graph()
