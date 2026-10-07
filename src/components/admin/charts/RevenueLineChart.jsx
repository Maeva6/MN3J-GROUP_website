import { useMemo, useState } from "react";

// Lissage Catmull-Rom → Bézier cubique : donne une courbe arrondie plutôt que
// des segments droits entre les points mensuels.
function smoothPath(points) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const L = 48;
const R = 16;
const T = 16;
const H = 208;
const VIEW_W = 720;
const W = VIEW_W - L - R;

// Courbe de CA mensuel avec aire, grille, comparaison N-1 en pointillés et
// tooltip au survol. `current`/`previous` sont des tableaux de même longueur
// que `months`, en M FCFA.
export default function RevenueLineChart({ months, current, previous, showPrevious = true }) {
  const [hover, setHover] = useState(null);
  const n = months.length;

  const max = useMemo(() => {
    const peak = Math.max(...current, ...(showPrevious && previous ? previous : [0]));
    return Math.max(15, Math.ceil(peak / 15) * 15);
  }, [current, previous, showPrevious]);

  const xs = (i) => L + (i * W) / (n - 1);
  const ys = (v) => T + H * (1 - v / max);
  const stepW = W / (n - 1);

  const line = smoothPath(current.map((v, i) => [xs(i), ys(v)]));
  const area = `${line} L${xs(n - 1)},${T + H} L${L},${T + H} Z`;
  const prevLine = showPrevious && previous ? smoothPath(previous.map((v, i) => [xs(i), ys(v)])) : null;
  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  const hasHover = hover !== null;
  const tipHeight = showPrevious && previous ? 58 : 40;
  const tipX = hasHover ? Math.max(L, Math.min(VIEW_W - R - 138, xs(hover) - 69)) : 0;
  const tipY = hasHover ? Math.max(0, ys(current[hover]) - 74) : 0;

  return (
    <div className="relative" onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${VIEW_W} 260`} className="w-full h-auto block overflow-visible">
        <defs>
          <linearGradient id="adminCaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2B5AA0" stopOpacity="0.22" />
            <stop offset="1" stopColor="#2B5AA0" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridValues.map((v) => (
          <g key={v}>
            <line x1={L} x2={VIEW_W - R} y1={ys(v)} y2={ys(v)} stroke="#eef1f4" />
            <text x={L - 10} y={ys(v) + 4} textAnchor="end" fontSize="11" fill="#9aa5b1">
              {v}M
            </text>
          </g>
        ))}
        {months.map((m, i) => (
          <text
            key={m + i}
            x={xs(i)}
            y="250"
            textAnchor="middle"
            fontSize="11"
            fill={hover === i ? "#1B3A63" : "#9aa5b1"}
            fontWeight={hover === i ? 700 : 400}
          >
            {m}
          </text>
        ))}

        {prevLine && (
          <path d={prevLine} fill="none" stroke="#9DB4D3" strokeWidth="2" strokeDasharray="5 5" className="admin-chart-fade" />
        )}
        <path d={area} fill="url(#adminCaFill)" className="admin-chart-fade" />
        <path
          d={line}
          fill="none"
          stroke="#2B5AA0"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1000}
          style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
          className="admin-chart-draw"
        />

        {hasHover && (
          <>
            <line x1={xs(hover)} x2={xs(hover)} y1="16" y2="224" stroke="#1B3A63" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <circle cx={xs(hover)} cy={ys(current[hover])} r="7" fill="#fff" stroke="#2B5AA0" strokeWidth="3" />
            <g transform={`translate(${tipX},${tipY})`}>
              <rect width="138" height={tipHeight} rx="8" fill="#12233d" />
              <text x="12" y="20" fontSize="11" fill="#9fb1c9">
                {months[hover]}
              </text>
              <text x="12" y="38" fontSize="14" fontWeight="700" fill="#fff">
                {current[hover]} M FCFA
              </text>
              {showPrevious && previous && (
                <text x="12" y="52" fontSize="10.5" fill="#a9e072">
                  N-1 : {previous[hover]} M ({current[hover] >= previous[hover] ? "+" : ""}
                  {Math.round((current[hover] / previous[hover] - 1) * 100)} %)
                </text>
              )}
            </g>
          </>
        )}

        {months.map((_, i) => (
          <rect
            key={i}
            x={xs(i) - stepW / 2}
            y="10"
            width={stepW}
            height="220"
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>
    </div>
  );
}
