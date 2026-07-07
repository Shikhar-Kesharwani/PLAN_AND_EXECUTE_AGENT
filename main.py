import os
from dotenv import load_dotenv
from graph.workflow import PLAN_EXECUTE_GRAPH

load_dotenv()


def run_agent(query: str) -> dict:
    """
    Run the Plan-and-Execute agent on a user query.
    Returns the complete state including final answer.
    """

    print(f"\n{'🚀'*25}")
    print(f"USER QUERY: {query}")
    print(f"{'🚀'*25}")

    # Initial state
    initial_state = {
        "user_query":        query,
        "rewritten_query":   query,
        "plan":              None,
        "current_step_idx":  0,
        "step_results":      [],
        "past_steps":        [],
        "replan_triggered":  False,
        "replan_reason":     None,
        "final_answer":      None,
        "is_complete":       False
    }

    # Run the graph
    final_state = PLAN_EXECUTE_GRAPH.invoke(
        initial_state,
        config={"recursion_limit": 25}
    )

    # Display result
    print(f"\n{'='*60}")
    print("📋 EXECUTION SUMMARY")
    print(f"{'='*60}")
    print(f"Steps completed: {len(final_state['step_results'])}")
    print(f"Replan triggered: {final_state['replan_triggered']}")
    print(f"\n{'='*60}")
    print("✅ FINAL ANSWER")
    print(f"{'='*60}")
    print(final_state["final_answer"])

    return final_state


# ─────────────────────────────────────────
# Test with different query types
# ─────────────────────────────────────────
if __name__ == "__main__":

    test_queries = [

        # Simple query — should generate 1-2 steps
        "What is binary search?",

        # Medium query — should generate 3-4 steps
        "Compare quicksort and mergesort with examples",

        # Complex query — should generate 4-6 steps
        """Compare quicksort and mergesort, explain when to use each
           in production, and give me 3 practice problems""",

        # Multi-topic query — tests replanning
        """Explain paging in OS, then explain indexing in DBMS,
           and show how both relate to performance optimization"""
    ]

    # Run one query
    result = run_agent(test_queries[2])
