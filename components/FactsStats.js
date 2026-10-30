"use client";
// "Facts & Stats" boxes. Values, texts and colours come from Django Admin.
// Numbers count up from 0 once (like on ughe.org); text such as "4TH" keeps its suffix.
import { useEffect, useState } from "react";

function CountUp({ value }) {
  const match = String(value).match(/^([\d,]+)(.*)$/);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(target === null ? null : 0);

  useEffect(() => {
    if (target === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return; }
    const start = performance.now();
    const duration = 1500;
    let frame;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  if (target === null) return <>{value}</>;
  return <>{n.toLocaleString("en-US")}{suffix}</>;
}

export default function FactsStats({ heading, stats }) {
  if (!stats.length) return null;
  return (
    <section className="container stats-section">
      <h2>{heading}</h2>
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.id} className="stat" style={{ background: s.background_color, color: s.text_color }}>
            <div className="stat-value"><CountUp value={s.value} /></div>
            <p className="stat-text">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
