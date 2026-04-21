import { useEffect, useRef } from "react";

const THEME_COLORS = {
  home: ["rgba(128, 90, 213, 0.62)", "rgba(34, 211, 238, 0.4)", "rgba(236, 72, 153, 0.2)"],
  product: ["rgba(168, 85, 247, 0.6)", "rgba(56, 189, 248, 0.35)", "rgba(244, 114, 182, 0.18)"],
  login: ["rgba(124, 58, 237, 0.58)", "rgba(34, 211, 238, 0.34)", "rgba(236, 72, 153, 0.2)"],
  register: ["rgba(124, 58, 237, 0.58)", "rgba(34, 211, 238, 0.34)", "rgba(236, 72, 153, 0.2)"],
  cart: ["rgba(109, 40, 217, 0.58)", "rgba(34, 211, 238, 0.34)", "rgba(244, 114, 182, 0.2)"],
  checkout: ["rgba(109, 40, 217, 0.58)", "rgba(34, 211, 238, 0.34)", "rgba(244, 114, 182, 0.2)"],
  orders: ["rgba(109, 40, 217, 0.58)", "rgba(34, 211, 238, 0.34)", "rgba(244, 114, 182, 0.2)"],
  admin: ["rgba(139, 92, 246, 0.6)", "rgba(34, 211, 238, 0.36)", "rgba(236, 72, 153, 0.18)"],
  vendor: ["rgba(139, 92, 246, 0.6)", "rgba(34, 211, 238, 0.36)", "rgba(236, 72, 153, 0.18)"],
  schema: ["rgba(139, 92, 246, 0.6)", "rgba(34, 211, 238, 0.36)", "rgba(236, 72, 153, 0.18)"],
};

export default function CanvasWavesBackground({ theme = "home" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const drawBlob = (x, y, radiusX, radiusY, color, opacity, phase) => {
      context.save();
      context.translate(x, y);
      context.scale(radiusX, radiusY);
      context.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const angle = (Math.PI * 2 * i) / 8;
        const wobble = 1 + Math.sin(time * 0.002 + phase + i) * 0.16;
        const px = Math.cos(angle) * wobble;
        const py = Math.sin(angle) * wobble;
        if (i === 0) {
          context.moveTo(px, py);
        } else {
          context.lineTo(px, py);
        }
      }
      context.closePath();
      context.globalAlpha = opacity;
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = gradient;
      context.fill();
      context.globalAlpha = 1;
      context.restore();
    };

    const drawFlowLine = (baseY, amplitude, frequency, color, phase, opacity) => {
      context.beginPath();
      context.moveTo(0, baseY);
      for (let x = 0; x <= width; x += 10) {
        const y = baseY + Math.sin((x * frequency) + phase) * amplitude;
        context.lineTo(x, y);
      }
      context.fillStyle = color;
      context.globalAlpha = opacity;
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fill();
      context.globalAlpha = 1;
    };

    const render = () => {
      const colors = THEME_COLORS[theme] || THEME_COLORS.home;
      context.clearRect(0, 0, width, height);
      const bgGradient = context.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "rgba(4, 4, 9, 0.96)");
      bgGradient.addColorStop(0.48, "rgba(17, 10, 34, 0.94)");
      bgGradient.addColorStop(1, "rgba(9, 7, 18, 0.96)");
      context.fillStyle = bgGradient;
      context.fillRect(0, 0, width, height);

      drawBlob(width * 0.2, height * 0.22, 210, 160, colors[0], 0.9, 0.5);
      drawBlob(width * 0.83, height * 0.22, 180, 150, colors[1], 0.78, 2.3);
      drawBlob(width * 0.76, height * 0.8, 250, 190, colors[2], 0.42, 1.7);
      drawBlob(width * 0.18, height * 0.82, 220, 170, colors[1], 0.38, 4.1);

      context.globalCompositeOperation = "screen";
      drawBlob(width * 0.34, height * 0.48, 280, 230, colors[0], 0.34, 1.2);
      drawBlob(width * 0.64, height * 0.55, 300, 240, colors[1], 0.28, 3.2);
      context.globalCompositeOperation = "source-over";

      drawFlowLine(height * 0.72, 24, 0.0082, colors[2], time * 0.0015, 0.16);
      drawFlowLine(height * 0.78, 18, 0.011, colors[0], time * 0.0011 + 1.3, 0.12);
      drawFlowLine(height * 0.84, 14, 0.015, colors[1], time * 0.0009 + 2.1, 0.1);

      context.strokeStyle = "rgba(255, 255, 255, 0.05)";
      context.lineWidth = 1;
      context.beginPath();
      for (let y = 0; y < height; y += 48) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();

      context.fillStyle = "rgba(255, 255, 255, 0.08)";
      for (let i = 0; i < 22; i += 1) {
        const size = 1.5 + (i % 3);
        const x = (width * ((i * 0.071) + (time * 0.00018))) % width;
        const y = (height * (0.08 + (i * 0.041))) % height;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      }

      time += 1;
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="canvas-waves" aria-hidden="true" />;
}
