// Mini-courbe compacte pour les cartes KPI (pas d'axes, pas de survol) —
// même technique de dessin animé que RevenueLineChart (pathLength normalisé).
export default function Sparkline({ values, color, fillOpacity = 0.18, height = 40 }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => [
    (i * 100) / (values.length - 1),
    27 - ((v - min) / range) * 24,
  ]);
  let line = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    line += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  const area = `${line} L100,30 L0,30 Z`;

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height }}>
      <path d={area} fill={color} fillOpacity={fillOpacity} className="admin-chart-fade" />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
        pathLength={300}
        style={{ strokeDasharray: 300, strokeDashoffset: 300 }}
        className="admin-chart-draw"
      />
    </svg>
  );
}
