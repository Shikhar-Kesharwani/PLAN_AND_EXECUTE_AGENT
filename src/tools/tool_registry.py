from langchain_core.tools import tool
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model=os.getenv("LLM_MODEL", "llama3-70b-8192")
)


# ─────────────────────────────────────────
# TOOL 0: Live Web Search (NEW)
# ─────────────────────────────────────────
@tool
def web_search(query: str) -> str:
    """
    Search the live internet for up-to-date information on any topic.
    Use this when you need current facts, recent events, or real-world data.
    """
    try:
        from duckduckgo_search import DDGS
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=5):
                results.append(f"**{r['title']}**\n{r['body']}\nSource: {r['href']}")
        if results:
            return "\n\n---\n\n".join(results)
        return "No results found for this query."
    except Exception as e:
        return f"Web search failed: {str(e)}. Falling back to internal knowledge."


# ─────────────────────────────────────────
# TOOL 1: Knowledge Retriever
# ─────────────────────────────────────────
@tool
def retrieve_knowledge(query: str) -> str:
    """
    Retrieve relevant information from the knowledge base
    for any technical or placement-related topic.
    """
    response = llm.invoke(
        f"You are a placement preparation expert. "
        f"Answer this specifically: {query}"
    )
    return response.content


# ─────────────────────────────────────────
# TOOL 2: Concept Explainer
# ─────────────────────────────────────────
@tool
def explain_concept(concept: str) -> str:
    """
    Explain a technical concept clearly with
    definition, how it works, and an example.
    """
    response = llm.invoke(
        f"""Explain '{concept}' for a placement interview.
        Include:
        1. Definition
        2. How it works
        3. Simple example
        4. Time/Space complexity (if applicable)
        Keep it concise but complete."""
    )
    return response.content


# ─────────────────────────────────────────
# TOOL 3: Comparison Generator
# ─────────────────────────────────────────
@tool
def compare_concepts(concept_a: str, concept_b: str) -> str:
    """
    Compare two technical concepts side by side.
    Returns a structured comparison table.
    """
    response = llm.invoke(
        f"""Compare '{concept_a}' vs '{concept_b}' for a placement interview.
        Structure as:
        | Aspect | {concept_a} | {concept_b} |
        Cover: definition, time complexity, space complexity,
        use cases, advantages, disadvantages."""
    )
    return response.content


# ─────────────────────────────────────────
# TOOL 4: Practice Problem Generator
# ─────────────────────────────────────────
@tool
def generate_practice_problems(topic: str, count: int = 3) -> str:
    """
    Generate practice interview problems for a given topic.
    Returns problems with hints.
    """
    response = llm.invoke(
        f"""Generate {count} placement interview practice problems
        on the topic: '{topic}'.
        For each problem:
        1. Problem statement
        2. Input/Output example
        3. Hint (not the solution)
        4. Difficulty: Easy/Medium/Hard"""
    )
    return response.content


# ─────────────────────────────────────────
# TOOL 5: Summarizer
# ─────────────────────────────────────────
@tool
def summarize_content(content: str) -> str:
    """
    Summarize long content into key bullet points.
    Useful for compiling results from multiple steps.
    """
    response = llm.invoke(
        f"Summarize this content into clear bullet points:\n{content}"
    )
    return response.content


# ─────────────────────────────────────────
# TOOL REGISTRY
# ─────────────────────────────────────────
ALL_TOOLS = [
    web_search,
    retrieve_knowledge,
    explain_concept,
    compare_concepts,
    generate_practice_problems,
    summarize_content
]

TOOL_MAP = {tool.name: tool for tool in ALL_TOOLS}
