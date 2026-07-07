/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: "#8b5cf6",
          pink:   "#ec4899",
          blue:   "#06b6d4",
          green:  "#10b981",
          orange: "#f97316",
        },
      },
      animation: {
        "gradient-x":   "gradient-x 4s ease infinite",
        "gradient-y":   "gradient-y 4s ease infinite",
        "float":        "float 6s ease-in-out infinite",
        "pulse-slow":   "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow":    "spin 8s linear infinite",
        "glow":         "glow 2s ease-in-out infinite alternate",
        "typing":       "typing 3s steps(30) infinite",
        "shimmer":      "shimmer 2s linear infinite",
        "bounce-slow":  "bounce 3s infinite",
        "slide-up":     "slide-up 0.5s ease-out",
        "slide-in":     "slide-in 0.5s ease-out",
        "fade-in":      "fade-in 0.8s ease-out",
        "matrix":       "matrix 20s linear infinite",
        "orb-1":        "orb1 8s ease-in-out infinite",
        "orb-2":        "orb2 10s ease-in-out infinite",
        "orb-3":        "orb3 12s ease-in-out infinite",
        "scan":         "scan 3s linear infinite",
        "flicker":      "flicker 0.15s infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%,100%": { "background-position": "0% 50%" },
          "50%":      { "background-position": "100% 50%" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-20px)" },
        },
        glow: {
          from: { "box-shadow": "0 0 20px #8b5cf6, 0 0 40px #8b5cf6" },
          to:   { "box-shadow": "0 0 40px #ec4899, 0 0 80px #ec4899" },
        },
        shimmer: {
          "0%":   { "background-position": "-200% 0" },
          "100%": { "background-position": "200% 0" },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(30px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: 0, transform: "translateX(-30px)" },
          to:   { opacity: 1, transform: "translateX(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        orb1: {
          "0%,100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%":     { transform: "translate(80px, -50px) scale(1.2)" },
          "66%":     { transform: "translate(-60px, 40px) scale(0.9)" },
        },
        orb2: {
          "0%,100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%":     { transform: "translate(-80px, 60px) scale(1.1)" },
          "66%":     { transform: "translate(60px, -40px) scale(1.3)" },
        },
        orb3: {
          "0%,100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%":     { transform: "translate(40px, 80px) scale(0.8)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%,100%": { opacity: 1 },
          "50%":     { opacity: 0.8 },
        },
        matrix: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backgroundSize: {
        "300%": "300%",
      },
      fontFamily: {
        mono: ["'Fira Code'", "monospace"],
        cyber: ["'Orbitron'", "monospace"],
      },
    },
  },
  plugins: [],
};
