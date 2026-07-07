import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain, Zap, GitBranch, Cpu, Network, RefreshCw } from "lucide-react";

const ROTATING_WORDS = [
  "PLANS",
  "EXECUTES",
  "REPLANS",
  "ADAPTS",
  "DELIVERS",
];

const STATS = [
  { label: "Agent Nodes",   value: "5",    icon: Network,   color: "text-purple-400" },
  { label: "Tools Active",  value: "5",    icon: Zap,       color: "text-pink-400"   },
  { label: "Steps Max",     value: "6",    icon: GitBranch, color: "text-cyan-400"   },
  { label: "LLM Powered",   value: "AI",   icon: Cpu,       color: "text-green-400"  },
];

export default function HeroSection({ onStart }) {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-y-auto">
      {/* ── HERO VIEW ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center justify-center 
                   min-h-screen text-center px-6 py-20"
      >
      {/* Top badge */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 flex items-center gap-2 glass rounded-full 
                   px-5 py-2 border border-purple-500/30"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-sm font-mono text-purple-300">
          LangGraph · Multi-Agent · Plan-and-Execute
        </span>
      </motion.div>

      {/* Main title */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h1 className="font-cyber font-black leading-none">
          <div className="text-5xl md:text-8xl text-white mb-2">
            THE AI THAT
          </div>
          <div className="text-5xl md:text-8xl relative h-[1.2em] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ y: 60, opacity: 0, rotateX: -90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: -60, opacity: 0, rotateX: 90 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="gradient-text absolute"
                style={{ perspective: "400px" }}
              >
                {ROTATING_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
      >
        A production-grade{" "}
        <span className="text-purple-400 font-semibold">Plan-and-Execute</span>{" "}
        AI agent built with{" "}
        <span className="text-pink-400 font-semibold">LangGraph</span>.
        It breaks complex questions into steps, executes each one,
        and{" "}
        <span className="text-cyan-400 font-semibold">replans on the fly</span>.
      </motion.p>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 w-full max-w-2xl"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 + i * 0.1, type: "spring" }}
            className="glass rounded-xl p-4 border border-white/5
                       hover:border-purple-500/30 transition-all group"
          >
            <stat.icon
              size={20}
              className={`${stat.color} mb-2 group-hover:scale-110 transition-transform`}
            />
            <div className={`text-2xl font-black ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Primary button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="relative group px-10 py-4 rounded-xl font-bold 
                     text-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 
                          via-pink-600 to-purple-600 bg-size-300 
                          animate-gradient-x" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                          transition-opacity blur-xl bg-gradient-to-r 
                          from-purple-600 to-pink-600" />
          <span className="relative flex items-center gap-2">
            <Brain size={20} />
            Launch Agent
          </span>
        </motion.button>

        {/* Secondary button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById("architecture-section")?.scrollIntoView({ behavior: "smooth" })}
          className="px-10 py-4 rounded-xl font-bold text-lg glass 
                     border border-purple-500/30 hover:border-purple-500 
                     transition-all text-purple-300"
        >
          <span className="flex items-center gap-2">
            <GitBranch size={20} />
            View Architecture
          </span>
        </motion.button>
      </motion.div>

      {/* Scroll hint */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        onClick={() => document.getElementById("architecture-section")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span className="text-xs text-gray-600 font-mono">SCROLL TO EXPLORE</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-transparent"
        />
      </motion.button>
      </motion.div>

      {/* ── ARCHITECTURE VIEW ── */}
      <div id="architecture-section" className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#030712]/80 backdrop-blur-sm border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full text-center"
        >
          <h2 className="text-3xl md:text-5xl font-cyber font-bold text-white mb-8">
            SYSTEM <span className="text-purple-500">ARCHITECTURE</span>
          </h2>
          <div className="glass-strong rounded-2xl p-8 border border-purple-500/30 text-left space-y-6">
             <div className="flex items-start gap-4">
                <Network className="text-purple-400 mt-1" size={24} />
                <div>
                   <h3 className="text-xl font-bold text-white mb-2">The Planner</h3>
                   <p className="text-gray-400">Breaks the user's complex query into a step-by-step directed acyclic graph of tasks. It decides the optimal path forward.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <Zap className="text-pink-400 mt-1" size={24} />
                <div>
                   <h3 className="text-xl font-bold text-white mb-2">The Executor</h3>
                   <p className="text-gray-400">Sequentially tackles each step, dynamically selecting the best tools for the job (Search, VectorDB, Calculation, etc).</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <RefreshCw className="text-cyan-400 mt-1" size={24} />
                <div>
                   <h3 className="text-xl font-bold text-white mb-2">The Replanner</h3>
                   <p className="text-gray-400">Evaluates the results. If a step failed or new information shifts the goal, it instantly drafts a revised plan to keep the agent on track.</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
