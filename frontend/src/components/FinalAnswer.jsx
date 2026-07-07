import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function FinalAnswer({ answer, steps, confidence }) {
  const [copied,    setCopied]    = useState(false);
  const [expanded,  setExpanded]  = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!answer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative"
    >
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 
                      to-pink-600/10 rounded-2xl blur-xl" />

      {/* Card */}
      <div className="relative holo-card rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 
                        border-b border-white/5">
          <div className="flex items-center gap-3">
            {/* Animated sparkle */}
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Sparkles className="text-yellow-400" size={20} />
            </motion.div>

            <div>
              <h3 className="font-black text-white text-lg">Final Answer</h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-gray-500 font-mono">
                  {steps} steps executed
                </span>
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                <span className="text-xs text-green-400 font-mono font-bold">
                  {Math.round(confidence * 100)}% confidence
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-2 glass rounded-lg border border-white/10 
                         hover:border-purple-500/50 transition-all"
            >
              {copied
                ? <Check size={16} className="text-green-400" />
                : <Copy size={16} className="text-gray-400" />
              }
            </motion.button>

            {/* Expand toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setExpanded(!expanded)}
              className="p-2 glass rounded-lg border border-white/10 
                         hover:border-purple-500/50 transition-all"
            >
              {expanded
                ? <ChevronUp size={16} className="text-gray-400" />
                : <ChevronDown size={16} className="text-gray-400" />
              }
            </motion.button>
          </div>
        </div>

        {/* Answer content */}
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            className="p-6 prose prose-invert prose-sm max-w-none
                       prose-headings:text-purple-300
                       prose-code:text-pink-300
                       prose-code:bg-pink-900/20
                       prose-strong:text-white
                       prose-a:text-purple-400"
          >
            <ReactMarkdown>{answer}</ReactMarkdown>
          </motion.div>
        )}

        {/* Bottom shimmer */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 shimmer" />
      </div>
    </motion.div>
  );
}
