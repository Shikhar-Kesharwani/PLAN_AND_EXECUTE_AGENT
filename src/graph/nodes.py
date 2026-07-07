from graph.state import PlanExecuteState, Plan, Step
from agents.planner import PlannerAgent, PlanSchema
from agents.executor import ExecutorAgent
from agents.replanner import ReplannerAgent
from langchain_groq import ChatGroq
import os

# Initialize agents
planner   = PlannerAgent()
executor  = ExecutorAgent()
replanner = ReplannerAgent()
llm       = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model=os.getenv("LLM_MODEL", "llama3-70b-8192")
)


# ─────────────────────────────────────────
# NODE 1: Planner Node
# ─────────────────────────────────────────
def planner_node(state: PlanExecuteState) -> dict:
    """
    Creates the initial plan from user query.
    """
    print(f"\n{'='*50}")
    print(f"🧠 PLANNER — Creating plan for: {state['user_query']}")
    print(f"{'='*50}")

    plan_schema = planner.create_plan(state["user_query"])

    # Convert to state-compatible format
    plan = Plan(
        objective=plan_schema.objective,
        steps=[
            Step(
                step_id=s.step_id,
                description=s.description,
                tool_to_use=s.tool_to_use,
                depends_on=s.depends_on,
                status="pending"
            )
            for s in plan_schema.steps
        ],
        total_steps=len(plan_schema.steps)
    )

    return {
        "plan":             plan,
        "current_step_idx": 0,
        "step_results":     [],
        "past_steps":       [],
        "is_complete":      False,
        "replan_triggered": False
    }


# ─────────────────────────────────────────
# NODE 2: Executor Node
# ─────────────────────────────────────────
def executor_node(state: PlanExecuteState) -> dict:
    """
    Executes the current step in the plan.
    """
    plan    = state["plan"]
    idx     = state["current_step_idx"]

    if idx >= len(plan.steps):
        return {"is_complete": True}

    current_step = plan.steps[idx]

    print(f"\n{'='*50}")
    print(f"⚙️  EXECUTOR — Step {idx + 1}/{len(plan.steps)}")
    print(f"{'='*50}")

    # Execute the step
    result = executor.execute_step(
        step_description=current_step.description,
        tool_name=current_step.tool_to_use,
        previous_results=state["step_results"],
        original_query=state["user_query"]
    )

    # Update step status
    plan.steps[idx].status = "done"
    plan.steps[idx].result = result

    # Update state
    updated_results = state["step_results"] + [{
        "step_id":     current_step.step_id,
        "description": current_step.description,
        "tool":        current_step.tool_to_use,
        "result":      result
    }]

    updated_past = state["past_steps"] + [
        f"Step {idx+1}: {current_step.description} → Completed"
    ]

    return {
        "plan":             plan,
        "step_results":     updated_results,
        "past_steps":       updated_past,
        "current_step_idx": idx  # replanner decides if we increment
    }


# ─────────────────────────────────────────
# NODE 3: Replanner Node
# ─────────────────────────────────────────
def replanner_node(state: PlanExecuteState) -> dict:
    """
    Evaluates current progress and decides:
    continue / replan / finish
    """
    plan = state["plan"]
    idx  = state["current_step_idx"]

    completed_steps = [
        {"step_id": s.step_id, "description": s.description}
        for s in plan.steps[:idx+1]
    ]
    remaining_steps = [
        {"step_id": s.step_id, "description": s.description}
        for s in plan.steps[idx+1:]
    ]

    latest_result = ""
    if state["step_results"]:
        latest_result = state["step_results"][-1]["result"]

    decision = replanner.should_replan(
        original_query=state["user_query"],
        objective=plan.objective,
        completed_steps=completed_steps,
        remaining_steps=remaining_steps,
        latest_result=latest_result
    )

    # Handle decision
    if decision["action"] == "finish":
        return {
            "is_complete":      True,
            "current_step_idx": idx + 1,
            "replan_triggered": False
        }

    elif decision["action"] == "replan" and decision.get("new_steps"):
        # Replace remaining steps with new ones
        new_step_objects = []
        for new_step in decision["new_steps"]:
            new_step_objects.append(Step(
                step_id=new_step.get("step_id", idx+2),
                description=new_step.get("description", ""),
                tool_to_use=new_step.get("tool_to_use", "retrieve_knowledge"),
                depends_on=new_step.get("depends_on", []),
                status="pending"
            ))

        # Keep completed steps, replace rest
        plan.steps = plan.steps[:idx+1] + new_step_objects
        plan.total_steps = len(plan.steps)

        return {
            "plan":             plan,
            "current_step_idx": idx + 1,
            "replan_triggered": True,
            "replan_reason":    decision["reason"]
        }

    else:
        # Continue — just increment step index
        return {
            "current_step_idx": idx + 1,
            "replan_triggered": False
        }


# ─────────────────────────────────────────
# NODE 4: Final Answer Node
# ─────────────────────────────────────────
def final_answer_node(state: PlanExecuteState) -> dict:
    """
    Compiles all step results into a final cohesive answer.
    """
    print(f"\n{'='*50}")
    print(f"📝 COMPILING FINAL ANSWER")
    print(f"{'='*50}")

    all_results = "\n\n".join([
        f"### {r['description']}\n{r['result']}"
        for r in state["step_results"]
    ])

    past_steps = "\n".join(state["past_steps"])

    prompt = f"""
You are PlacementPrep AI. Compile a complete, well-structured answer.

ORIGINAL QUESTION: {state['user_query']}

STEPS COMPLETED:
{past_steps}

ALL GATHERED INFORMATION:
{all_results}

Compile this into ONE cohesive, well-structured answer that:
1. Directly answers the original question
2. Uses headers and bullet points for clarity
3. Flows naturally (not just pasted sections)
4. Is ready to help someone prepare for placement interviews
"""

    response = llm.invoke(prompt)

    return {
        "final_answer": response.content,
        "is_complete":  True
    }
