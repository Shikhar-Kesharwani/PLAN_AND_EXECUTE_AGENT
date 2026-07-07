from langchain_groq import ChatGroq
from typing import List
import json
import os
from dotenv import load_dotenv

load_dotenv()

class ReplannerAgent:
    """
    After each step execution, the Replanner checks:
    1. Is the plan still valid given what we learned?
    2. Do we need to add/remove/modify steps?
    3. Have we achieved the objective yet?
    """

    def __init__(self):
        self.llm = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model=os.getenv("LLM_MODEL", "llama3-70b-8192")
        )

    def should_replan(self,
                      original_query: str,
                      objective: str,
                      completed_steps: List[dict],
                      remaining_steps: List[dict],
                      latest_result: str) -> dict:
        """
        Decide whether to continue, replan, or finish.
        Returns: { action: "continue"/"replan"/"finish",
                   reason: str, new_steps: list }
        """

        completed_summary = "\n".join([
            f"Step {s['step_id']}: {s['description']} → Done"
            for s in completed_steps
        ])

        remaining_summary = "\n".join([
            f"Step {s['step_id']}: {s['description']}"
            for s in remaining_steps
        ])

        prompt = f"""
You are a strategic replanner for an AI agent.

ORIGINAL QUERY: {original_query}
OBJECTIVE: {objective}

COMPLETED STEPS:
{completed_summary}

LATEST STEP RESULT (first 500 chars):
{latest_result[:500]}

REMAINING PLANNED STEPS:
{remaining_summary}

DECISION: Should the agent:
A) CONTINUE - proceed with remaining steps as planned
B) REPLAN   - modify the remaining steps based on new information
C) FINISH   - the objective is already achieved, stop here

Rules:
- Choose FINISH if the latest result already fully answers the query
- Choose REPLAN if the result revealed the plan is wrong or incomplete
- Choose CONTINUE in all other cases

Return ONLY this JSON:
{{
  "action": "continue" OR "replan" OR "finish",
  "reason": "brief explanation",
  "new_steps": []
}}

If action is "replan", populate new_steps with updated step list.
If action is "continue" or "finish", new_steps should be [].
"""

        response = self.llm.invoke(prompt)

        try:
            raw = response.content.strip()
            if "```json" in raw:
                raw = raw.split("```json")[1].split("```")[0]
            elif "```" in raw:
                raw = raw.split("```")[1].split("```")[0]

            result = json.loads(raw)
            print(f"\n🔄 REPLANNER: {result['action'].upper()} — {result['reason']}")
            return result

        except Exception as e:
            print(f"Replanner parse error: {e}")
            return {"action": "continue", "reason": "Parse error, continuing", "new_steps": []}
