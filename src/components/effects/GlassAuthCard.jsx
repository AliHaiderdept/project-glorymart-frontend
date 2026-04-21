import { useState } from "react";

export default function GlassAuthCard({ title, subtitle, children }) {
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  return (
    <div
      className="glass-auth-card"
      style={{ ["--glow-x"]: `${glow.x}%`, ["--glow-y"]: `${glow.y}%` }}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        setGlow({ x, y });
      }}
      onMouseLeave={() => setGlow({ x: 50, y: 50 })}
    >
      <div className="glass-auth-card-inner p-4 p-md-5">
        {title ? <h3 className="mb-2 auth-title">{title}</h3> : null}
        {subtitle ? <p className="mb-4 auth-subtitle">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  );
}
