import { useState } from "react";
import useMountReady from "../../../pages/admin/useMountReady";

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Donut "répartition du CA par pôle" : segments survolables (liste et arcs
// réagissent ensemble), centre affiche le total ou le segment survolé.
export default function PoleDonutChart({ segments, totalLabel }) {
  const [hover, setHover] = useState(null);
  const ready = useMountReady();
  const total = segments.reduce((sum, s) => sum + s.amount, 0) || 1;

  let cumulative = 0;
  const arcs = segments.map((s, i) => {
    const len = (s.amount / total) * CIRCUMFERENCE;
    const arc = {
      ...s,
      pct: Math.round((s.amount / total) * 100),
      // Vide (0 CIRCUMFERENCE) jusqu'au montage, puis pousse vers sa vraie
      // longueur : sans ce décalage, le cercle apparaît déjà plein et la
      // transition CSS n'a rien à animer.
      dash: ready ? `${Math.max(0, len - 3)} ${CIRCUMFERENCE}` : `0 ${CIRCUMFERENCE}`,
      offset: -cumulative,
      strokeWidth: hover === i ? 28 : 22,
    };
    cumulative += len;
    return arc;
  });
  const active = hover !== null ? arcs[hover] : null;

  return (
    <div>
      <div className="relative flex justify-center mb-2">
        <svg width="190" height="190" viewBox="0 0 190 190">
          <circle cx="95" cy="95" r={RADIUS} fill="none" stroke="#eef1f4" strokeWidth="22" />
          {arcs.map((a, i) => (
            <circle
              key={a.label}
              cx="95"
              cy="95"
              r={RADIUS}
              fill="none"
              stroke={a.color}
              strokeWidth={a.strokeWidth}
              strokeDasharray={a.dash}
              strokeDashoffset={a.offset}
              transform="rotate(-90 95 95)"
              style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1), stroke-width .2s", cursor: "pointer" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display font-extrabold text-2xl text-navy">{active ? `${active.pct}%` : totalLabel}</span>
          <span className="text-[11.5px] text-muted">{active ? active.label : "FCFA sur 12 mois"}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {arcs.map((a, i) => (
          <div
            key={a.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`flex items-center gap-2.5 text-[13px] px-2 py-1.5 rounded-md transition-colors ${hover === i ? "bg-surface" : ""}`}
          >
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: a.color }} />
            <span className="flex-1 text-ink truncate">{a.label}</span>
            <span className="text-muted">{a.amount} M</span>
            <span className="font-bold text-navy w-9 text-right">{a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
