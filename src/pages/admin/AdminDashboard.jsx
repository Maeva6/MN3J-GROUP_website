import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, HardHat, Clock, FileText, Wallet } from "lucide-react";
import { projects, statusStyles, progressBarClass } from "../../data/projects";
import {
  quotes,
  quoteStatuses,
  quoteStatusStyles,
  clients,
  projectExtras,
  poleLabels,
  monthlyRevenue,
  teamMembers,
} from "../../data/adminData";
import Avatar from "../../components/admin/Avatar";
import RevenueLineChart from "../../components/admin/charts/RevenueLineChart";
import PoleDonutChart from "../../components/admin/charts/PoleDonutChart";

// Anime le chiffre de 0 jusqu'à sa valeur finale au montage (indépendant de
// framer-motion : un nombre affiché comme texte, pas une transform/opacity,
// s'anime plus simplement avec un requestAnimationFrame direct).
function CountUp({ value, duration = 700 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    let start;
    const step = (timestamp) => {
      if (start === undefined) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return display;
}

const pipelineColors = {
  "Nouveau": "#2B5AA0",
  "Contacté": "#E6A23C",
  "Accepté": "#7DBF3F",
  "Refusé": "#d26a5c",
};

function parseFcfa(value) {
  return Number(String(value).replace(/[^\d]/g, "")) || 0;
}

function ConversionGauge({ percent }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90 shrink-0">
      <circle cx="50" cy="50" r={radius} fill="none" className="stroke-surface" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        className="stroke-teal"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)" }}
      />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        className="fill-navy"
        style={{ font: "bold 20px Poppins, sans-serif", transform: "rotate(90deg)", transformOrigin: "50px 50px" }}
      >
        {percent}%
      </text>
    </svg>
  );
}

// Fil d'activité récente — dérivé des vraies données (chantiers/devis), pas
// inventé : chaque ligne pointe vers un chantier ou un devis réel. Les
// libellés de délai ("il y a 2 h"…) sont indicatifs, faute d'horodatage réel.
function buildActivity() {
  const items = [];
  const enCours = projects.filter((p) => p.status === "En cours" && p.progress > 0);
  if (enCours[0]) {
    items.push({
      who: teamMembers[projectExtras[enCours[0].id]?.team?.[0]]?.name.split(" ")[0] || "Équipe",
      text: `a fait avancer « ${enCours[0].name.split(" – ")[0]} » à ${enCours[0].progress} %`,
      when: "il y a 3 h",
      color: "#E6A23C",
    });
  }
  const nouveau = quotes.find((q) => q.status === "Nouveau");
  if (nouveau) {
    items.push({ who: "Système", text: `nouvelle demande de devis de ${nouveau.name}`, when: "il y a 5 h", color: "#9DB4D3" });
  }
  const accepte = quotes.find((q) => q.status === "Accepté");
  if (accepte) {
    items.push({ who: "Moussa N.", text: `a validé le devis de ${accepte.name}`, when: "hier", color: "#7DBF3F" });
  }
  const realise = projects.find((p) => p.status === "Réalisé");
  if (realise) {
    items.push({ who: "Équipe", text: `a marqué « ${realise.name.split(" – ")[0]} » comme réalisé`, when: "il y a 2 j", color: "#2B5AA0" });
  }
  const refuse = quotes.find((q) => q.status === "Refusé");
  if (refuse) {
    items.push({ who: "Système", text: `devis de ${refuse.name} refusé`, when: "il y a 3 j", color: "#d26a5c" });
  }
  return items;
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState("12m");

  const enCours = projects.filter((p) => p.status === "En cours").length;
  const realises = projects.filter((p) => p.status === "Réalisé").length;
  const planifies = projects.filter((p) => p.status === "Planifié").length;
  const nouveauxDevis = quotes.filter((q) => q.status === "Nouveau").length;
  const totalValeurClients = clients.reduce((sum, c) => sum + parseFcfa(c.totalValue), 0);
  const tauxConversion = quotes.length
    ? Math.round((quotes.filter((q) => q.status === "Accepté").length / quotes.length) * 100)
    : 0;
  const caTotal = monthlyRevenue.current.reduce((a, b) => a + b, 0);

  const n = period === "12m" ? 12 : 6;
  const months = monthlyRevenue.months.slice(-n);
  const current = monthlyRevenue.current.slice(-n);
  const previous = monthlyRevenue.previous.slice(-n);
  const periodTotal = current.reduce((a, b) => a + b, 0);
  const prevTotal = previous.reduce((a, b) => a + b, 0);
  const periodDelta = Math.round((periodTotal / prevTotal - 1) * 100);

  const kpis = [
    {
      icon: Wallet,
      value: caTotal,
      label: "Chiffre d'affaires (12 mois)",
      sub: `${caTotal.toLocaleString("fr-FR")} M FCFA`,
      highlight: true,
    },
    {
      icon: HardHat,
      value: enCours,
      label: "Chantiers en cours",
      sub: `${projects.length} au total`,
    },
    {
      icon: FileText,
      value: nouveauxDevis,
      label: "Devis en attente",
      sub: quotes.length ? `${Math.round((nouveauxDevis / quotes.length) * 100)}% des devis reçus` : "—",
    },
    {
      icon: Clock,
      value: tauxConversion,
      label: "Taux de conversion",
      sub: `${quotes.filter((q) => q.status === "Accepté").length} devis acceptés sur ${quotes.length}`,
      suffix: "%",
    },
  ];

  // Répartition du CA par pôle, calculée à partir des budgets de chantiers
  // réels (projectExtras) groupés par pôle — pas une donnée inventée à part.
  const poleAmounts = {};
  projects.forEach((p) => {
    const budget = projectExtras[p.id]?.budget ?? 0;
    poleAmounts[p.poleId] = (poleAmounts[p.poleId] || 0) + budget;
  });
  const poleSegments = Object.entries(poleAmounts)
    .filter(([, amount]) => amount > 0)
    .map(([poleId, amount]) => ({ label: poleLabels[poleId]?.label || poleId, amount, color: poleLabels[poleId]?.color || "#9DB4D3" }))
    .sort((a, b) => b.amount - a.amount);
  const poleTotal = poleSegments.reduce((a, s) => a + s.amount, 0);

  const pipeline = quoteStatuses.map((status) => ({
    status,
    count: quotes.filter((q) => q.status === status).length,
  }));
  const maxPipeline = Math.max(1, ...pipeline.map((p) => p.count));

  const recentQuotes = quotes.slice(0, 5);
  const activity = buildActivity();

  const rows = projects.map((p) => {
    const extra = projectExtras[p.id] || {};
    return { ...p, ...extra };
  });

  return (
    <>
      <div className="grid md:grid-cols-4 gap-5">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className={`group rounded-lg p-6 cursor-default transition-shadow duration-300 ${
              k.highlight
                ? "bg-gradient-to-br from-navy to-blue text-white hover:shadow-card"
                : "bg-white border border-black/5 hover:shadow-card hover:border-navy/10"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                k.highlight ? "bg-white/15" : "bg-navy/5"
              }`}
            >
              <k.icon size={16} className={k.highlight ? "text-white" : "text-navy"} />
            </div>
            <div className={`text-2xl font-display font-bold ${k.highlight ? "text-white" : "text-navy"}`}>
              <CountUp value={k.value} />
              {k.suffix || ""}
            </div>
            <div className={`text-xs mt-1 ${k.highlight ? "text-white/70" : "text-muted"}`}>{k.label}</div>
            <div
              className={`text-[11px] font-semibold mt-2 inline-block px-2 py-0.5 rounded-full transition-colors duration-300 ${
                k.highlight ? "bg-white/15 text-white" : "bg-green/15 text-green-dark group-hover:bg-green/25"
              }`}
            >
              {k.sub}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-black/5 rounded-lg p-6">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <h2 className="text-navy font-semibold text-sm">Chiffre d'affaires mensuel</h2>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-xl font-display font-extrabold text-ink">{periodTotal} M FCFA</span>
                <span className={`text-xs font-bold ${periodDelta >= 0 ? "text-green-dark" : "text-[#B3261E]"}`}>
                  {periodDelta >= 0 ? "▲" : "▼"} {Math.abs(periodDelta)} % vs N-1
                </span>
              </div>
            </div>
            <div className="flex bg-surface rounded-md p-1">
              {[
                ["6m", "6 mois"],
                ["12m", "12 mois"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPeriod(key)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                    period === key ? "bg-white text-navy shadow-sm" : "text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <RevenueLineChart months={months} current={current} previous={previous} />
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-lg p-6">
          <h2 className="text-navy font-semibold text-sm">Répartition par pôle</h2>
          <div className="text-xs text-muted mt-1 mb-2">Part du budget cumulé des chantiers</div>
          <PoleDonutChart segments={poleSegments} totalLabel={`${poleTotal}M`} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white border border-black/5 rounded-lg p-6">
          <h2 className="text-navy font-semibold text-sm">Pipeline des devis</h2>
          <div className="text-xs text-muted mt-1">{quotes.length} demandes reçues</div>
          <div className="flex flex-col gap-4 mt-5">
            {pipeline.map(({ status, count }) => (
              <div key={status}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="text-ink font-medium">{status}</span>
                  <span className="font-bold text-navy">{count}</span>
                </div>
                <div className="h-2.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-700"
                    style={{ width: `${(count / maxPipeline) * 100}%`, background: pipelineColors[status] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
            <h2 className="text-navy font-semibold text-sm">Derniers devis</h2>
            <Link to="/admin/devis" className="text-blue text-xs font-semibold flex items-center gap-1 hover:underline">
              Voir tout <ArrowRight size={13} />
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {recentQuotes.map((q) => (
              <li key={q.id} className="px-6 py-3 flex items-center gap-3 hover:bg-surface transition-colors">
                <Avatar name={q.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-navy truncate">{q.name}</span>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${quoteStatusStyles[q.status]}`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{q.projectType}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-black/5 rounded-lg p-6">
          <h2 className="text-navy font-semibold text-sm mb-1">Taux de conversion devis</h2>
          <div className="flex items-center gap-4 mt-3">
            <ConversionGauge percent={tauxConversion} />
            <div>
              <div className="text-xs text-muted leading-relaxed">
                {quotes.filter((q) => q.status === "Accepté").length} devis acceptés sur {quotes.length}
              </div>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-black/5">
            <h3 className="text-navy font-semibold text-xs mb-3">Activité récente</h3>
            <div className="flex flex-col">
              {activity.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full border-2 bg-white mt-1 shrink-0" style={{ borderColor: a.color }} />
                    {i < activity.length - 1 && <span className="flex-1 w-px bg-black/5 my-1" />}
                  </div>
                  <div className="pb-4 text-[12.5px] leading-relaxed">
                    <span className="font-semibold text-navy">{a.who}</span> {a.text}
                    <div className="text-[11px] text-muted mt-0.5">{a.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-navy font-semibold text-sm">Suivi des chantiers</h2>
            <div className="text-[11.5px] text-muted mt-0.5">
              {realises} réalisés · {enCours} en cours · {planifies} planifiés
            </div>
          </div>
          <Link to="/admin/chantiers" className="text-blue text-xs font-semibold flex items-center gap-1 hover:underline">
            Gérer <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-xs text-muted uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Chantier</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium">Progression</th>
                <th className="px-6 py-3 font-medium">Équipe</th>
                <th className="px-6 py-3 font-medium">Échéance</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 6).map((p) => (
                <tr key={p.id} className="border-t border-black/5 hover:bg-surface transition-colors">
                  <td className="px-6 py-3 font-medium text-navy max-w-[260px] truncate">{p.name}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-24 h-1.5 bg-black/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progressBarClass(p.progress)}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-navy w-9 shrink-0">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex -space-x-1.5">
                      {(p.team || []).map((i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center ${teamMembers[i]?.bg || "bg-navy-light"}`}
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted whitespace-nowrap">{p.dueLabel || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
