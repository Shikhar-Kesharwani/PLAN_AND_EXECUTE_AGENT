from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))
from graph.workflow import PLAN_EXECUTE_GRAPH
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Plan-and-Execute Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post("/api/agent/run")
async def run_agent_api(request: QueryRequest):
    print(f"Received query: {request.query}")
    initial_state = {
        "user_query":        request.query,
        "rewritten_query":   request.query,
        "plan":              None,
        "current_step_idx":  0,
        "step_results":      [],
        "past_steps":        [],
        "replan_triggered":  False,
        "replan_reason":     None,
        "final_answer":      None,
        "is_complete":       False
    }

    try:
        final_state = PLAN_EXECUTE_GRAPH.invoke(
            initial_state,
            config={"recursion_limit": 25}
        )
        
        plan = final_state.get("plan")
        if plan:
            if hasattr(plan, 'model_dump'):
                plan = plan.model_dump()
            elif hasattr(plan, 'dict'):
                plan = plan.dict()
            
        step_results = final_state.get("step_results", [])
        serialized_step_results = []
        for result in step_results:
            if hasattr(result, 'model_dump'):
                serialized_step_results.append(result.model_dump())
            elif hasattr(result, 'dict'):
                serialized_step_results.append(result.dict())
            elif isinstance(result, dict):
                serialized_step_results.append(result)
            else:
                serialized_step_results.append(str(result))

        return {
            "user_query": final_state.get("user_query"),
            "plan": plan,
            "step_results": serialized_step_results,
            "replan_triggered": final_state.get("replan_triggered", False),
            "replan_reason": final_state.get("replan_reason"),
            "final_answer": final_state.get("final_answer"),
            "is_complete": final_state.get("is_complete", False)
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
