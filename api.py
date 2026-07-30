from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import sys
import os
import json
import asyncio
import uuid
from datetime import datetime
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))
from graph.workflow import PLAN_EXECUTE_GRAPH
import uvicorn
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

# ─────────────────────────────────────────
# In-memory session history store
# ─────────────────────────────────────────
session_history = []  # list of { session_id, query, final_answer, timestamp, steps }


class QueryRequest(BaseModel):
    query: str
    session_id: str = None  # optional – if omitted, a new session is created


# ─────────────────────────────────────────
# ENDPOINT 1: Standard (non-streaming) run
# ─────────────────────────────────────────
@app.post("/api/agent/run")
async def run_agent_api(request: QueryRequest):
    print(f"Received query: {request.query}")
    session_id = request.session_id or str(uuid.uuid4())

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
        config = {"configurable": {"thread_id": session_id}}
        final_state = PLAN_EXECUTE_GRAPH.invoke(initial_state, config=config)

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

        # Save to session history
        session_history.append({
            "session_id":   session_id,
            "query":        request.query,
            "final_answer": final_state.get("final_answer", ""),
            "steps":        len(serialized_step_results),
            "timestamp":    datetime.utcnow().isoformat() + "Z"
        })
        # Keep last 50 sessions in memory
        if len(session_history) > 50:
            session_history.pop(0)

        return {
            "session_id":       session_id,
            "user_query":       final_state.get("user_query"),
            "plan":             plan,
            "step_results":     serialized_step_results,
            "replan_triggered": final_state.get("replan_triggered", False),
            "replan_reason":    final_state.get("replan_reason"),
            "final_answer":     final_state.get("final_answer"),
            "is_complete":      final_state.get("is_complete", False)
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────
# ENDPOINT 2: SSE Streaming run (NEW)
# ─────────────────────────────────────────
@app.post("/api/agent/stream")
async def stream_agent_api(request: QueryRequest):
    """
    Streams graph node updates back to the client via Server-Sent Events.
    Each node emits a JSON event as it completes.
    """
    session_id = request.session_id or str(uuid.uuid4())

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

    async def event_generator():
        try:
            config = {"configurable": {"thread_id": session_id}}
            # Stream node-by-node updates
            async for event in PLAN_EXECUTE_GRAPH.astream(
                initial_state,
                config=config,
                stream_mode="updates"
            ):
                for node_name, node_output in event.items():
                    # Serialize Pydantic objects
                    serializable = {}
                    for k, v in node_output.items():
                        if hasattr(v, 'model_dump'):
                            serializable[k] = v.model_dump()
                        elif hasattr(v, 'dict'):
                            serializable[k] = v.dict()
                        else:
                            serializable[k] = v

                    payload = json.dumps({
                        "node":   node_name,
                        "output": serializable
                    })
                    yield f"data: {payload}\n\n"
                    await asyncio.sleep(0)  # yield control

            # Save to history after full stream
            yield f"data: {json.dumps({'node': 'done', 'session_id': session_id})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'node': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control":  "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


# ─────────────────────────────────────────
# ENDPOINT 3: Session History (NEW)
# ─────────────────────────────────────────
@app.get("/api/history")
async def get_history():
    """Returns last 50 agent sessions in reverse chronological order."""
    return {"history": list(reversed(session_history))}


# ─────────────────────────────────────────
# ENDPOINT 4: Health check
# ─────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
