import { useId } from "react";

// Mini-courbe compacte pour les cartes KPI (pas d'axes, pas de survol) —
// même technique de dessin animé que RevenueLineChart (pathLength normalisé).
export default function Sparkline({ values, color, fillOpacity = 0.35, height = 40 }) {
  // useId() renvoie des deux-points (":r0:"), invalides dans une référence
  // url(#id) — on les retire pour un identifiant d'id SVG sûr.
  const gradientId = `sparkline-fill-${useId().replace(/:/g, "")}`;
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
      <defs>
        {/* Dégradé plutôt qu'un aplat transparent uniforme : un creux réel
            dans les données (le CA peut reculer un mois avant de remonter)
            laissait voir le fond sombre de la carte à travers le remplissage
            plat, donnant l'impression que la ligne "flottait" au-dessus d'un
            trou. Le dégradé reste visible juste sous le tracé même dans un
            creux, donc la forme se lit comme une seule courbe continue. */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={fillOpacity} />
          <stop offset="1" stopColor={color} stopOpacity={fillOpacity * 0.15} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} className="admin-chart-fade" />
      {/* Pas d'animation "dessin" par stroke-dasharray ici (contrairement à
          RevenueLineChart) : ce SVG utilise preserveAspectRatio="none" pour
          s'étirer exactement à la taille de la carte, et cet étirement non
          uniforme combiné à vector-effect="non-scaling-stroke" fait que les
          navigateurs calculent mal la longueur du tracé — le trait animé
          s'arrêtait au milieu au lieu de rejoindre le bord droit. Un simple
          fondu (comme le remplissage) reste fiable quelle que soit l'échelle. */}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
        className="admin-chart-fade"
      />
    </svg>
  );
}
