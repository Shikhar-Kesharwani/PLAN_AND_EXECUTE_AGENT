from langchain_groq import ChatGroq
from pydantic import BaseModel
from typing import List
import json
import os
from dotenv import load_dotenv

load_dotenv()

class StepSchema(BaseModel):
    step_id:     int
    description: str
    tool_to_use: str
    depends_on:  List[int] = []

class PlanSchema(BaseModel):
    objective: str
    steps:     List[StepSchema]

class PlannerAgent:
    """
    Creates a structured, ordered plan to answer
    a complex user query using available tools.
    """

    def __init__(self):
        self.llm = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model=os.getenv("LLM_MODEL", "llama3-70b-8192")
        )

    def create_plan(self, user_query: str) -> PlanSchema:
        """
        Given a user query, create a step-by-step plan.
        Each step uses exactly one tool.
        """

        prompt = f"""
You are a strategic planner for an AI placement preparation assistant.

USER QUERY: {user_query}

AVAILABLE TOOLS:
- web_search(query)               → Search the LIVE internet for current facts and data
- retrieve_knowledge(query)       → Search knowledge base for info
- explain_concept(concept)        → Explain a technical concept
- compare_concepts(a, b)          → Compare two concepts
- generate_practice_problems(topic, count) → Make practice problems
- summarize_content(content)      → Summarize text

TOOL SELECTION RULES:
- Use web_search for: current events, real-world data, recent research, company info
- Use retrieve_knowledge for: general CS/placement concepts from training data
- Use explain_concept for: deep technical concept breakdowns
- Use compare_concepts for: side-by-side comparisons (A vs B)
- Use generate_practice_problems for: creating interview questions
- Use summarize_content ONLY as the FINAL step to compile all results

YOUR TASK:
Create a step-by-step plan to fully answer the user query.
Break complex queries into logical sub-tasks.
Each step must use exactly ONE tool.

RULES:
1. Maximum 6 steps (keep it efficient)
2. Minimum 1 step (don't over-complicate simple queries)
3. If a step depends on results from a previous step,
   list its step_id in depends_on
4. The last step should always compile/summarize everything

Return ONLY this JSON format:
{{
  "objective": "what we are trying to achieve",
  "steps": [
    {{
      "step_id": 1,
      "description": "what this step does",
      "tool_to_use": "tool_name",
      "depends_on": []
    }},
    {{
      "step_id": 2,
      "description": "what this step does",
      "tool_to_use": "tool_name",
      "depends_on": [1]
    }}
  ]
}}
"""

        response = self.llm.invoke(prompt)

        # Parse JSON response
        try:
            raw = response.content.strip()
            # Extract JSON if wrapped in markdown
            if "```json" in raw:
                raw = raw.split("```json")[1].split("```")[0]
            elif "```" in raw:
                raw = raw.split("```")[1].split("```")[0]

            data = json.loads(raw)
            plan = PlanSchema(**data)

            print(f"\n📋 PLAN CREATED: {plan.objective}")
            for step in plan.steps:
                print(f"  Step {step.step_id}: {step.description}")
                print(f"    Tool: {step.tool_to_use}")

            return plan

        except Exception as e:
            print(f"Plan parsing error: {e}")
            # Fallback: simple single-step plan
            return PlanSchema(
                objective=user_query,
                steps=[
                    StepSchema(
                        step_id=1,
                        description=f"Answer: {user_query}",
                        tool_to_use="retrieve_knowledge",
                        depends_on=[]
                    )
                ]
            )
