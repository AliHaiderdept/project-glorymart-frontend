import { useEffect, useRef } from "react";

const paletteByPage = {
  home: ["rgba(168,85,247,0.35)", "rgba(34,211,238,0.25)", "rgba(236,72,153,0.2)"],
  listing: ["rgba(147,51,234,0.32)", "rgba(56,189,248,0.22)", "rgba(59,130,246,0.16)"],
  detail: ["rgba(192,132,252,0.3)", "rgba(34,211,238,0.22)", "rgba(236,72,153,0.18)"],
  cart: ["rgba(139,92,246,0.26)", "rgba(34,211,238,0.18)", "rgba(217,70,239,0.16)"],
  checkout: ["rgba(124,58,237,0.24)", "rgba(34,211,238,0.16)", "rgba(99,102,241,0.16)"],
  orders: ["rgba(124,58,237,0.24)", "rgba(34,211,238,0.16)", "rgba(99,102,241,0.16)"],
  auth: ["rgba(168,85,247,0.32)", "rgba(34,211,238,0.2)", "rgba(236,72,153,0.2)"],
  vendor: ["rgba(34,211,238,0.2)", "rgba(139,92,246,0.24)", "rgba(244,114,182,0.16)"],
  admin: ["rgba(79,70,229,0.18)", "rgba(6,182,212,0.14)", "rgba(168,85,247,0.14)"],
};

export default function AnimatedBackground({ page = "home" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let raf = 0;
    const particles = Array.from({ length: 46 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 0.6,
      speed: Math.random() * 0.0004 + 0.0001,
      drift: (index % 2 === 0 ? 1 : -1) * (Math.random() * 0.00025 + 0.00008),
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = () => {
      const colors = paletteByPage[page] || paletteByPage.home;
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#05030a");
      gradient.addColorStop(0.5, "#120d26");
      gradient.addColorStop(1, "#07070f");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const g1 = ctx.createRadialGradient(width * 0.14, height * 0.18, 30, width * 0.14, height * 0.18, width * 0.45);
      g1.addColorStop(0, colors[0]);
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * 0.82, height * 0.78, 30, width * 0.82, height * 0.78, width * 0.42);
      g2.addColorStop(0, colors[1]);
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speed;
        p.x += p.drift;
        if (p.y > 1.08) p.y = -0.06;
        if (p.x > 1.08) p.x = -0.08;
        if (p.x < -0.08) p.x = 1.08;

        const px = p.x * width;
        const py = p.y * height;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220, 236, 255, 0.22)";
        ctx.fill();
      });

      raf = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [page]);

  return <canvas ref={canvasRef} className="animated-bg-canvas" aria-hidden="true" />;
}
