import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars  = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()PLANNER→EXECUTOR→REPLAN";
    const cols   = Math.floor(canvas.width / 16);
    const drops  = Array(cols).fill(1);

    function draw() {
      ctx.fillStyle = "rgba(3, 7, 18, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const char  = chars[Math.floor(Math.random() * chars.length)];
        const shade = Math.random() > 0.97 ? "#ffffff" : Math.random() > 0.8 ? "#8b5cf6" : "#8b5cf630";

        ctx.fillStyle = shade;
        ctx.font      = "14px 'Fira Code', monospace";
        ctx.fillText(char, i * 16, y * 16);

        if (y * 16 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    }

    const interval = setInterval(draw, 60);

    const handleResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-20"
    />
  );
}
