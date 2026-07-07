from typing import Optional
from tools.tool_registry import TOOL_MAP

class ExecutorAgent:
    """
    Executes a single step from the plan by calling
    the appropriate tool with the right input.
    """

    def execute_step(self,
                     step_description: str,
                     tool_name: str,
                     previous_results: list,
                     original_query: str) -> str:
        """
        Execute one plan step.
        Builds the tool input from context and runs the tool.
        """

        print(f"\n⚙️  EXECUTING: {step_description}")
        print(f"   Tool: {tool_name}")

        # Get the tool
        tool = TOOL_MAP.get(tool_name)
        if not tool:
            return f"Error: Tool '{tool_name}' not found."

        # Build context from previous results
        context = ""
        if previous_results:
            context = "\n".join([
                f"Previous step result: {r['result'][:300]}..."
                for r in previous_results[-2:]  # last 2 results
            ])

        # Build tool input based on tool type
        try:
            if tool_name == "retrieve_knowledge":
                result = tool.invoke({"query": step_description})

            elif tool_name == "explain_concept":
                # Extract concept name from description
                concept = self._extract_concept(step_description)
                result = tool.invoke({"concept": concept})

            elif tool_name == "compare_concepts":
                a, b = self._extract_comparison(step_description)
                result = tool.invoke({
                    "concept_a": a,
                    "concept_b": b
                })

            elif tool_name == "generate_practice_problems":
                topic = self._extract_topic(step_description)
                result = tool.invoke({
                    "topic": topic,
                    "count": 3
                })

            elif tool_name == "summarize_content":
                # Summarize all previous results
                all_results = "\n\n".join([
                    r['result'] for r in previous_results
                ])
                result = tool.invoke({"content": all_results})

            else:
                result = tool.invoke({"query": step_description})

            print(f"   ✅ Step complete ({len(result)} chars)")
            return result

        except Exception as e:
            error_msg = f"Tool execution failed: {str(e)}"
            print(f"   ❌ {error_msg}")
            return error_msg

    def _extract_concept(self, description: str) -> str:
        """Extract concept name from step description."""
        keywords = ["explain", "about", "regarding", "on", "for"]
        desc_lower = description.lower()
        for kw in keywords:
            if kw in desc_lower:
                idx = desc_lower.index(kw) + len(kw)
                return description[idx:].strip()
        return description

    def _extract_comparison(self, description: str) -> tuple:
        """Extract two concepts to compare."""
        for separator in [" vs ", " and ", " versus ", " compared to "]:
            if separator in description.lower():
                parts = description.lower().split(separator)
                return parts[0].strip(), parts[1].strip()
        # Fallback
        words = description.split()
        mid = len(words) // 2
        return " ".join(words[:mid]), " ".join(words[mid:])

    def _extract_topic(self, description: str) -> str:
        """Extract topic from step description."""
        return description.replace("Generate practice problems for", "")\
                         .replace("Create problems about", "")\
                         .strip()
