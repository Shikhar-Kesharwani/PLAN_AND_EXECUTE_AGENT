import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Zap } from "lucide-react";

const EXAMPLE_QUERIES = [
  "Compare quicksort and mergesort with examples and practice problems",
  "Explain paging in OS and its relation to performance optimization",
  "What is dynamic programming? Give examples and practice problems",
  "Compare SQL vs NoSQL databases and when to use each",
  "Explain binary trees, BST, and AVL trees with comparisons",
];

export default function QueryInput({ onSubmit, isLoading }) {
  const [query, setQuery]           = useState("");
  const [focused, setFocused]       = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [charCount, setCharCount]   = useState(0);
  const textareaRef = useRef();

  useEffect(() => {
    setCharCount(query.length);
  }, [query]);

  const handleSubmit = () => {
    if (!query.trim() || isLoading) return;
    onSubmit(query.trim());
    setQuery("");
    setShowExamples(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const setExample = (ex) => {
    setQuery(ex);
    setShowExamples(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">

      {/* Glow ring when focused */}
      <motion.div
        animate={focused ? {
          opacity: 1,
          scale: 1.02,
          boxShadow: "0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(236,72,153,0.15)",
        } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl pointer-events-none"
      />

      {/* Main input container */}
      <motion.div
        animate={focused ? { borderColor: "rgba(139,92,246,0.6)" } : { borderColor: "rgba(255,255,255,0.08)" }}
        className="relative glass rounded-2xl border overflow-hidden"
      >
        {/* Top shimmer when focused */}
        {focused && (
          <div className="absolute top-0 left-0 right-0 h-0.5 shimmer" />
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
          disabled={isLoading}
          placeholder="Ask anything complex... The agent will plan, execute, and adapt."
          rows={3}
          className="w-full bg-transparent text-white placeholder-gray-600 
                     p-5 pb-2 resize-none outline-none font-mono text-sm
                     leading-relaxed"
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-5 py-3 
                        border-t border-white/5">
          <div className="flex items-center gap-3">
            {/* Examples button */}
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center gap-1.5 text-xs text-gray-500 
                         hover:text-purple-400 transition-colors font-mono"
            >
              <Sparkles size={13} />
              Examples
            </button>

            {/* Char counter */}
            <span className="text-xs text-gray-700 font-mono">
              {charCount} chars
            </span>

            {/* Keyboard hint */}
            <span className="text-xs text-gray-700 font-mono hidden sm:block">
              ⌘ + Enter to send
            </span>
          </div>

          {/* Send button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
            className={`
              relative flex items-center gap-2 px-5 py-2.5 rounded-xl
              font-bold text-sm transition-all overflow-hidden
              ${query.trim() && !isLoading
                ? "text-white cursor-pointer"
                : "text-gray-600 cursor-not-allowed"
              }
            `}
          >
            {query.trim() && !isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r 
                              from-purple-600 to-pink-600 rounded-xl" />
            )}
            {!query.trim() && (
              <div className="absolute inset-0 bg-gray-800 rounded-xl" />
            )}
            <span className="relative flex items-center gap-2">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Zap size={16} />
                </motion.div>
              ) : (
                <Send size={16} />
              )}
              {isLoading ? "Running..." : "Execute"}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Examples dropdown */}
      <AnimatePresence>
        {showExamples && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full glass-strong rounded-xl 
                       border border-purple-500/20 overflow-hidden z-50"
          >
            <div className="p-2">
              <div className="text-xs text-gray-500 font-mono px-3 py-2">
                EXAMPLE QUERIES
              </div>
              {EXAMPLE_QUERIES.map((ex, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 4, backgroundColor: "rgba(139,92,246,0.1)" }}
                  onClick={() => setExample(ex)}
                  className="w-full text-left text-sm text-gray-300 px-3 py-2.5 
                             rounded-lg transition-all font-mono leading-relaxed"
                >
                  <span className="text-purple-500 mr-2">▶</span>
                  {ex}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
