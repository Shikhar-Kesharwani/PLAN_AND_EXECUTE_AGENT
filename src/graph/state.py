from typing import TypedDict, List, Optional, Union
from pydantic import BaseModel

# ─────────────────────────────────────────
# Plan Schema
# ─────────────────────────────────────────

class Step(BaseModel):
    """A single step in the plan."""
    step_id:     int
    description: str
    tool_to_use: str   # which tool executor should call
    depends_on:  List[int] = []  # step IDs this depends on
    status:      str = "pending"  # pending / running / done / failed
    result:      Optional[str] = None

class Plan(BaseModel):
    """The complete plan created by Planner."""
    objective:   str
    steps:       List[Step]
    total_steps: int

# ─────────────────────────────────────────
# LangGraph State
# ─────────────────────────────────────────

class PlanExecuteState(TypedDict):

    # Original user input
    user_query:        str

    # Planning
    plan:              Optional[Plan]
    current_step_idx:  int        # which step we are on

    # Execution
    step_results:      List[dict] # results from each step
    past_steps:        List[str]  # human-readable log

    # Replanning
    replan_triggered:  bool
    replan_reason:     Optional[str]

    # Output
    final_answer:      Optional[str]
    is_complete:       bool
