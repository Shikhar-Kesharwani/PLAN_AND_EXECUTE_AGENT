import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Background3D  from "./components/Background3D";
import MatrixRain    from "./components/MatrixRain";
import GlowOrbs      from "./components/GlowOrbs";
import HeroSection   from "./components/HeroSection";
import QueryInput    from "./components/QueryInput";
import PlanVisualizer from "./components/PlanVisualizer";
import FinalAnswer   from "./components/FinalAnswer";
import { Brain, ChevronLeft, Activity, History, X, Clock, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─────────────────────────────────────────
// SSE STREAMING HOOK
// ─────────────────────────────────────────
function useAgentStream() {
  const [state, setState] = useState({
    plan:            null,
    stepResults:     [],
    finalAnswer:     null,
    isLoading:       false,
    currentStepIdx:  -1,
    replanTriggered: false,
    replanReason:    null,
    confidence:      0,
    streamingNode:   null,   // which node is currently running
  });

  const abortRef = useRef(null);

  async function run(query) {
    // Reset state
    setState({
      plan: null, stepResults: [], finalAnswer: null,
      isLoading: true, currentStepIdx: -1,
      replanTriggered: false, replanReason: null,
      confidence: 0, streamingNode: "planner",
    });

    try {
      // Use SSE streaming endpoint
      const res = await fetch(`${API_URL}/api/agent/stream`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ query }),
        signal:  abortRef.current?.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop(); // keep incomplete chunk

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let event;
          try { event = JSON.parse(raw); } catch { continue; }

          if (event.node === "done") {
            setState(s => ({ ...s, isLoading: false, streamingNode: null, confidence: 0.95 }));
            continue;
          }
          if (event.node === "error") {
            setState(s => ({ ...s, isLoading: false, streamingNode: null,
              finalAnswer: "Error: " + event.message }));
            continue;
          }

          const out = event.output || {};

          // ── Planner output ──────────────────────────────
          if (event.node === "planner" && out.plan) {
            const plan = out.plan;
            const planWithPending = {
              ...plan,
              steps: plan.steps.map(s => ({ ...s, status: "pending" })),
            };
            setState(s => ({ ...s, plan: planWithPending, streamingNode: "executor" }));
          }

          // ── Executor output ─────────────────────────────
          if (event.node === "executor") {
            const newResult = out.step_results?.slice(-1)[0];
            const idx       = (out.current_step_idx ?? 0);

            setState(s => {
              if (!s.plan) return s;
              const updatedSteps = s.plan.steps.map((step, i) =>
                i < idx      ? { ...step, status: "done" }    :
                i === idx    ? { ...step, status: "running" } :
                               step
              );
              const updatedResults = newResult
                ? [...s.stepResults.filter(r => r.step_id !== newResult.step_id), newResult]
                : s.stepResults;
              return {
                ...s,
                plan:           { ...s.plan, steps: updatedSteps },
                stepResults:    updatedResults,
                currentStepIdx: idx,
                streamingNode:  "replanner",
              };
            });
          }

          // ── Replanner output ────────────────────────────
          if (event.node === "replanner") {
            setState(s => ({
              ...s,
              replanTriggered: out.replan_triggered ?? s.replanTriggered,
              replanReason:    out.replan_reason    ?? s.replanReason,
              streamingNode:   "executor",
            }));
          }

          // ── Final answer output ─────────────────────────
          if (event.node === "final_answer" && out.final_answer) {
            setState(s => {
              // Mark all steps done
              const doneSteps = s.plan
                ? { ...s.plan, steps: s.plan.steps.map(st => ({ ...st, status: "done" })) }
                : s.plan;
              return {
                ...s,
                plan:        doneSteps,
                finalAnswer: out.final_answer,
                streamingNode: null,
              };
            });
          }
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        console.error(e);
        setState(s => ({ ...s, isLoading: false, finalAnswer: "Error: " + e.message }));
      }
    }
  }

  function loadHistorySession(session) {
    setState({
      plan:            null,
      stepResults:     [],
      finalAnswer:     session.final_answer,
      isLoading:       false,
      currentStepIdx:  -1,
      replanTriggered: false,
      replanReason:    null,
      confidence:      0.95,
      streamingNode:   null,
    });
  }

  return { state, run, loadHistorySession };
}


// ─────────────────────────────────────────
// HISTORY SIDEBAR
// ─────────────────────────────────────────
function HistorySidebar({ isOpen, onClose, onSelect }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/api/history`)
        .then(r => r.json())
        .then(d => setHistory(d.history || []))
        .catch(() => setHistory([]));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 z-50 glass border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History size={18} className="text-purple-400" />
                <span className="font-bold text-white">Session History</span>
              </div>
              <button onClick={onClose}
                className="p-1.5 glass rounded-lg border border-white/10 hover:border-purple-500/50 transition-all">
                <X size={14} className="text-gray-400" />
              </button>
            </div>

            {/* History list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {history.length === 0 ? (
                <div className="text-center text-gray-500 text-sm mt-8">
                  <Clock size={32} className="mx-auto mb-2 opacity-30" />
                  No sessions yet.<br/>Run a query to see history.
                </div>
              ) : (
                history.map((session, i) => (
                  <motion.button
                    key={session.session_id || i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => { onSelect(session); onClose(); }}
                    className="w-full text-left p-3 glass rounded-xl border border-white/5
                               hover:border-purple-500/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-white font-medium line-clamp-2 flex-1">
                        {session.query}
                      </p>
                      <ChevronRight size={14} className="text-gray-500 mt-0.5 shrink-0
                        group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-500 font-mono">
                        {session.steps} steps
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(session.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
export default function App() {
  const [screen,          setScreen]         = useState("hero");
  const [historyOpen,     setHistoryOpen]    = useState(false);
  const { state, run, loadHistorySession }   = useAgentStream();

  const handleQuery = async (query) => { await run(query); };

  return (
    <div className="relative min-h-screen bg-[#030712] scanlines font-inter text-white overflow-x-hidden">

      {/* ── Backgrounds ─────────────────── */}
      <MatrixRain />
      <GlowOrbs />
      <Background3D />

      {/* ── Grid overlay ────────────────── */}
      <div className="fixed inset-0 grid-overlay z-0 pointer-events-none opacity-50" />

      {/* ── Scan line effect ────────────── */}
      <div className="fixed top-0 left-0 w-full h-px bg-gradient-to-r
                      from-transparent via-purple-500 to-transparent z-50
                      opacity-30 animate-scan pointer-events-none" />

      {/* ── History Sidebar ──────────────── */}
      <HistorySidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={loadHistorySession}
      />

      {/* ── Screen transitions ──────────── */}
      <AnimatePresence mode="wait">

        {/* HERO SCREEN */}
        {screen === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <HeroSection onStart={() => setScreen("agent")} />
          </motion.div>
        )}

        {/* AGENT SCREEN */}
        {screen === "agent" && (
          <motion.div
            key="agent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen flex flex-col"
          >
            {/* ── Top navbar ──────────── */}
            <nav className="sticky top-0 z-50 glass border-b border-white/5">
              <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                {/* Left: back + logo */}
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ x: -3 }}
                    onClick={() => setScreen("hero")}
                    className="p-2 glass rounded-lg border border-white/10
                               hover:border-purple-500/50 transition-all"
                  >
                    <ChevronLeft size={16} className="text-gray-400" />
                  </motion.button>

                  <div className="flex items-center gap-2">
                    <Brain size={20} className="text-purple-500" />
                    <span className="font-cyber font-bold text-lg tracking-wider">
                      PLAN<span className="text-purple-500">_EXECUTE</span>
                    </span>
                  </div>
                </div>

                {/* Right: status + history button */}
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <Activity size={14} className="text-green-400" />
                    {state.streamingNode
                      ? <span className="text-yellow-400 animate-pulse">
                          RUNNING: {state.streamingNode.toUpperCase()}
                        </span>
                      : "STATUS: ONLINE"
                    }
                  </div>

                  {/* History button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHistoryOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg
                               border border-white/10 hover:border-purple-500/50
                               transition-all text-xs text-gray-400 font-mono"
                  >
                    <History size={14} className="text-purple-400" />
                    History
                  </motion.button>
                </div>
              </div>
            </nav>

            {/* ── Main content ──────────── */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">

              {/* Input Area */}
              <div className="mb-12">
                <QueryInput onSubmit={handleQuery} isLoading={state.isLoading} />
              </div>

              {/* Live streaming node indicator */}
              <AnimatePresence>
                {state.streamingNode && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 flex items-center gap-3 px-4 py-3 glass rounded-xl
                               border border-purple-500/30"
                  >
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <motion.div key={i}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-purple-300">
                      Agent is running node: <strong>{state.streamingNode}</strong>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Area */}
              <div className="space-y-8 pb-32">
                {state.plan && (
                  <PlanVisualizer
                    plan={state.plan}
                    stepResults={state.stepResults}
                    replanTriggered={state.replanTriggered}
                    replanReason={state.replanReason}
                  />
                )}

                {state.finalAnswer && (
                  <FinalAnswer
                    answer={state.finalAnswer}
                    steps={state.stepResults.length}
                    confidence={state.confidence}
                    query={state.plan?.objective || ""}
                    stepResults={state.stepResults}
                  />
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
