import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Loader, AlertCircle,
         ArrowDown, RefreshCw } from "lucide-react";

const STATUS_CONFIG = {
  pending:  { icon: Circle,      color: "text-gray-500",  bg: "bg-gray-800",   border: "border-gray-700",  glow: "" },
  running:  { icon: Loader,      color: "text-purple-400", bg: "bg-purple-900/30", border: "border-purple-500", glow: "neon-border" },
  done:     { icon: CheckCircle, color: "text-green-400", bg: "bg-green-900/20", border: "border-green-500", glow: "neon-border-blue" },
  failed:   { icon: AlertCircle, color: "text-red-400",   bg: "bg-red-900/20",   border: "border-red-500",   glow: "" },
};

const TOOL_COLORS = {
  retrieve_knowledge:       { color: "#8b5cf6", label: "🔍 Retriever" },
  explain_concept:          { color: "#06b6d4", label: "💡 Explainer" },
  compare_concepts:         { color: "#ec4899", label: "⚖️ Comparator" },
  generate_practice_problems:{ color: "#f97316", label: "🎯 Practice" },
  summarize_content:        { color: "#10b981", label: "📝 Summarizer" },
};

function StepNode({ step, index, isActive, result }) {
  const config  = STATUS_CONFIG[step.status];
  const Icon    = config.icon;
  const tool    = TOOL_COLORS[step.tool_to_use] || { color: "#8b5cf6", label: step.tool_to_use };
  const isLast  = false;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, type: "spring" }}
      className="relative"
    >
      {/* Step card */}
      <motion.div
        animate={
          step.status === "running"
            ? { boxShadow: ["0 0 0px #8b5cf6", "0 0 30px #8b5cf6", "0 0 0px #8b5cf6"] }
            : {}
        }
        transition={{ repeat: Infinity, duration: 1.5 }}
        className={`
          relative glass rounded-2xl p-5 border transition-all duration-500
          ${config.bg} ${config.border}
        `}
      >
        {/* Step number + status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Step circle */}
            <div
              className={`
                relative w-10 h-10 rounded-full flex items-center justify-center
                font-black text-sm border-2 ${config.border}
                ${step.status === "running" ? "animate-pulse-slow" : ""}
              `}
              style={{
                background: `${tool.color}20`,
                borderColor: tool.color,
              }}
            >
              <span style={{ color: tool.color }}>{index + 1}</span>
              {step.status === "running" && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-50"
                  style={{ background: `${tool.color}30` }}
                />
              )}
            </div>

            <div>
              <div className="font-semibold text-white text-sm leading-tight">
                {step.description}
              </div>
              <div className="text-xs mt-1" style={{ color: tool.color }}>
                {tool.label}
              </div>
            </div>
          </div>

          {/* Status icon */}
          <motion.div
            animate={step.status === "running" ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Icon size={20} className={config.color} />
          </motion.div>
        </div>

        {/* Shimmer bar when running */}
        {step.status === "running" && (
          <div className="h-1 rounded-full bg-gray-800 overflow-hidden mb-3">
            <div className="h-full shimmer rounded-full" />
          </div>
        )}

        {/* Result preview */}
        <AnimatePresence>
          {result && step.status === "done" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-lg p-3 mt-2 border border-green-500/20">
                <div className="text-xs text-green-400 font-mono mb-1">
                  ✓ RESULT
                </div>
                <p className="text-xs text-gray-400 line-clamp-3 font-mono">
                  {result}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Connector line */}
      <div className="flex justify-center my-1">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: index * 0.15 + 0.3 }}
          className="w-0.5 h-6 connector origin-top"
        />
      </div>
    </motion.div>
  );
}

function ReplanBadge({ reason }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2 glass-strong rounded-xl px-4 py-3
                 border border-orange-500/40 my-4"
    >
      <RefreshCw size={16} className="text-orange-400 animate-spin" />
      <div>
        <div className="text-xs text-orange-400 font-bold">REPLAN TRIGGERED</div>
        <div className="text-xs text-gray-400 mt-0.5">{reason}</div>
      </div>
    </motion.div>
  );
}

export default function PlanVisualizer({ plan, stepResults, replanTriggered, replanReason }) {
  if (!plan) return null;

  return (
    <div className="w-full">

      {/* Plan header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-5 mb-6 border border-purple-500/30"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
            Active Plan
          </span>
        </div>
        <h3 className="text-white font-bold text-lg">{plan.objective}</h3>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs text-gray-500">
            {plan.steps.length} steps planned
          </span>
          <span className="text-xs text-gray-500">
            {stepResults.length} completed
          </span>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stepResults.length / plan.steps.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <span className="text-xs text-purple-400 font-bold">
            {Math.round((stepResults.length / plan.steps.length) * 100)}%
          </span>
        </div>
      </motion.div>

      {/* Replan badge */}
      {replanTriggered && <ReplanBadge reason={replanReason} />}

      {/* Step nodes */}
      <div className="space-y-0">
        {plan.steps.map((step, i) => (
          <StepNode
            key={step.step_id}
            step={step}
            index={i}
            isActive={step.status === "running"}
            result={stepResults.find((r) => r.step_id === step.step_id)?.result}
          />
        ))}
      </div>

      {/* Last connector to result */}
      <div className="flex justify-center my-1">
        <div className="w-0.5 h-6 connector" />
      </div>
    </div>
  );
}
