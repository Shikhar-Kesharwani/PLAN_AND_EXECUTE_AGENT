export default function GlowOrbs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* Orb 1 — Purple */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-orb-1"
        style={{
          top:    "-200px",
          left:   "-200px",
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orb 2 — Pink */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full animate-orb-2"
        style={{
          bottom: "-150px",
          right:  "-150px",
          background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orb 3 — Cyan */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full animate-orb-3"
        style={{
          top:   "50%",
          left:  "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Orb 4 — Green accent */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          top:   "30%",
          right: "10%",
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "orb2 14s ease-in-out infinite",
        }}
      />

    </div>
  );
}
