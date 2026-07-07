import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Background3D  from "./components/Background3D";
import MatrixRain    from "./components/MatrixRain";
import GlowOrbs      from "./components/GlowOrbs";
import HeroSection   from "./components/HeroSection";
import QueryInput    from "./components/QueryInput";
import PlanVisualizer from "./components/PlanVisualizer";
import FinalAnswer   from "./components/FinalAnswer";
import { Brain, ChevronLeft, Activity, Layers, Terminal } from "lucide-react";

// ─────────────────────────────────────────
// API CALL — REAL FETCH TO BACKEND
// ─────────────────────────────────────────
async function runAgent(query) {
  const res = await fetch("http://localhost:8000/api/agent/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// ─────────────────────────────────────────
// STEP-BY-STEP SIMULATION HOOK
// ─────────────────────────────────────────
function useAgentSimulation() {
  const [state, setState] = useState({
    plan:            null,
    stepResults:     [],
    finalAnswer:     null,
    isLoading:       false,
    currentStepIdx:  -1,
    replanTriggered: false,
    replanReason:    null,
    confidence:      0,
  });

  async function run(query) {
    setState(s => ({ ...s, isLoading: true, plan: null,
                     stepResults: [], finalAnswer: null,
                     currentStepIdx: -1, replanTriggered: false, replanReason: null }));

    try {
      // Get plan from API
      const result = await runAgent(query);

      // The backend will return the FULL final state.
      // We will parse it and show it nicely.
      // Ensure 'plan' structure matches what PlanVisualizer expects.
      const plan = result.plan;
      const step_results = result.step_results;
      
      const planWithPending = {
        ...plan,
        steps: plan.steps.map(s => ({ ...s, status: "pending" }))
      };
      
      setState(s => ({ ...s, plan: planWithPending }));

      // Simulate step-by-step UI execution based on the result
      for (let i = 0; i < plan.steps.length; i++) {
        // Wait a bit
        await new Promise(r => setTimeout(r, 400));

        // Mark current step as running
        setState(s => ({
          ...s,
          currentStepIdx: i,
          plan: {
            ...s.plan,
            steps: s.plan.steps.map((step, idx) =>
              idx === i ? { ...step, status: "running" } : step
            )
          }
        }));

        await new Promise(r => setTimeout(r, 800));

        // Find result for this step if it exists
        const stepResult = step_results.find(sr => sr.step_id === plan.steps[i].step_id) || {
            step_id: plan.steps[i].step_id,
            description: plan.steps[i].description,
            result: "Step completed"
        };

        // Mark step as done + add result
        setState(s => ({
          ...s,
          plan: {
            ...s.plan,
            steps: s.plan.steps.map((step, idx) =>
              idx === i ? { ...step, status: "done" } : step
            )
          },
          stepResults: [...s.stepResults, stepResult]
        }));
      }

      // Show final answer
      await new Promise(r => setTimeout(r, 600));
      setState(s => ({
        ...s,
        finalAnswer:     result.final_answer || "No final answer provided.",
        isLoading:       false,
        replanTriggered: result.replan_triggered,
        replanReason:    result.replan_reason,
        confidence:      0.95, // mock confidence
      }));
    } catch (e) {
      console.error(e);
      setState(s => ({ ...s, isLoading: false, finalAnswer: "Error running agent: " + e.message }));
    }
  }

  return { state, run };
}

// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("hero"); // hero | agent
  const { state, run }      = useAgentSimulation();

  const handleQuery = async (query) => {
    await run(query);
  };

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
              <div className="max-w-7xl mx-auto px-6 py-3 flex items-center 
                              justify-between">

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

                {/* Right: stats */}
                <div className="flex items-center gap-6 hidden sm:flex">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <Activity size={14} className="text-green-400" />
                    STATUS: ONLINE
                  </div>
                </div>
              </div>
            </nav>

            {/* ── Main content ──────────── */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
               
               {/* Input Area */}
               <div className="mb-12">
                 <QueryInput onSubmit={handleQuery} isLoading={state.isLoading} />
               </div>

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
