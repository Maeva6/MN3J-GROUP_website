import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, HardHat, FileText } from "lucide-react";
import { projects, statusStyles, progressBarClass } from "../../data/projects";
import {
  quotes,
  quoteStatuses,
  quoteStatusStyles,
  clients,
  projectExtras,
  poleLabels,
  monthlyRevenue,
  pendingQuotesTrend,
  teamMembers,
} from "../../data/adminData";
import Avatar from "../../components/admin/Avatar";
import RevenueLineChart from "../../components/admin/charts/RevenueLineChart";
import PoleDonutChart from "../../components/admin/charts/PoleDonutChart";
import Sparkline from "../../components/admin/charts/Sparkline";
import { useAdminHeaderActions } from "./AdminHeaderContext";
import useMountReady from "./useMountReady";

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
  const ready = useMountReady();
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Cercle vide (offset = circumference) jusqu'au montage, puis se remplit :
  // comme pour le donut, sans ce décalage il n'y a rien à animer.
  const offset = ready ? circumference * (1 - percent / 100) : circumference;
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90 shrink-0">
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
        style={{ font: "bold 19px Poppins, sans-serif", transform: "rotate(90deg)", transformOrigin: "50px 50px" }}
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
  const navigate = useNavigate();
  const ready = useMountReady();
  const [period, setPeriod] = useState("12m");
  const [search, setSearch] = useState("");

  const enCours = projects.filter((p) => p.status === "En cours").length;
  const realises = projects.filter((p) => p.status === "Réalisé").length;
  const planifies = projects.filter((p) => p.status === "Planifié").length;
  const nouveauxDevis = quotes.filter((q) => q.status === "Nouveau").length;
  const totalValeurClients = clients.reduce((sum, c) => sum + parseFcfa(c.totalValue), 0);
  const tauxConversion = quotes.length
    ? Math.round((quotes.filter((q) => q.status === "Accepté").length / quotes.length) * 100)
    : 0;
  const caTotal = monthlyRevenue.current.reduce((a, b) => a + b, 0);
  const caPrevTotal = monthlyRevenue.previous.reduce((a, b) => a + b, 0);
  const caDelta = Math.round((caTotal / caPrevTotal - 1) * 100);

  // Date du jour + salutation personnalisée (en-tête du tableau de bord
  // uniquement, comme dans la maquette) — le prénom vient de la même fiche
  // "MN" que le bloc utilisateur de la sidebar, pour rester cohérent si ce
  // nom change un jour.
  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const firstName = teamMembers.MN.name.split(" ")[0];

  // En-tête commun (AdminLayout) : recherche filtrant le tableau "Suivi des
  // chantiers" plus bas, et bouton "Nouveau chantier" renvoyant vers la page
  // Chantiers avec l'intention d'ouvrir directement le formulaire d'ajout.
  useAdminHeaderActions({
    dateLabel,
    greeting: `Bonjour ${firstName}, voici l'activité du mois`,
    showSearch: true,
    searchValue: search,
    onSearchChange: setSearch,
    searchPlaceholder: "Rechercher un chantier…",
    newLabel: "Nouveau chantier",
    onNew: () => navigate("/admin/chantiers", { state: { openAdd: true } }),
  });

  const n = period === "12m" ? 12 : 6;
  const months = monthlyRevenue.months.slice(-n);
  const current = monthlyRevenue.current.slice(-n);
  const previous = monthlyRevenue.previous.slice(-n);
  const periodTotal = current.reduce((a, b) => a + b, 0);
  const prevTotal = previous.reduce((a, b) => a + b, 0);
  const periodDelta = Math.round((periodTotal / prevTotal - 1) * 100);

  const mix = [
    { label: "Réalisés", count: realises, color: "bg-green", dot: "#7DBF3F" },
    { label: "En cours", count: enCours, color: "bg-[#E6A23C]", dot: "#E6A23C" },
    { label: "Planifiés", count: planifies, color: "bg-navy-light", dot: "#3F6690" },
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

  const rows = projects
    .map((p) => ({ ...p, ...(projectExtras[p.id] || {}) }))
    .filter((p) => (p.name + p.location + p.client).toLowerCase().includes(search.toLowerCase()));

  const cardMotion = (i) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
    whileHover: { y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } },
  });

  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. Chiffre d'affaires — carte mise en avant, courbe de fond */}
        <motion.div
          {...cardMotion(0)}
          className="relative overflow-hidden rounded-lg p-5 sm:p-6 bg-gradient-to-br from-navy to-blue text-white hover:shadow-card transition-shadow duration-300"
        >
          <span className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/[0.06]" />
          <div className="flex justify-between items-center relative">
            <span className="text-[13px] text-white/80">Chiffre d'affaires (12 mois)</span>
            <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${caDelta >= 0 ? "bg-green/25 text-[#c6ec9d]" : "bg-[#B3261E]/30 text-white"}`}>
              {caDelta >= 0 ? "▲" : "▼"} {Math.abs(caDelta)} %
            </span>
          </div>
          <div className="font-display font-extrabold text-[26px] sm:text-[32px] mt-2.5 relative">
            <CountUp value={caTotal} /> <span className="text-[15px] font-semibold text-white/80 ml-1">M FCFA</span>
          </div>
          <div className="mt-2.5 relative">
            <Sparkline values={monthlyRevenue.current} color="#7DBF3F" fillOpacity={0.25} />
          </div>
        </motion.div>

        {/* 2. Chantiers actifs — fraction + mix de statuts */}
        <motion.div {...cardMotion(1)} className="bg-white border border-black/5 rounded-lg p-5 sm:p-6 hover:shadow-card transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-muted">Chantiers actifs</span>
            <span className="w-9 h-9 rounded-lg bg-[#fdf1dc] flex items-center justify-center shrink-0">
              <HardHat size={16} className="text-[#A8650F]" />
            </span>
          </div>
          <div className="font-display font-extrabold text-[26px] sm:text-[32px] text-navy mt-2">
            <CountUp value={enCours} /> <span className="text-[15px] font-semibold text-muted ml-1">/ {projects.length}</span>
          </div>
          <div className="flex gap-1 mt-3.5 h-2 rounded overflow-hidden">
            {mix.map((m, i) => (
              <div
                key={m.label}
                className={`${m.color} transition-[width] duration-[1200ms] ease-out`}
                style={{
                  width: ready && projects.length ? `${(m.count / projects.length) * 100}%` : "0%",
                  transitionDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <div className="flex gap-3.5 mt-2.5 text-[11.5px] text-muted flex-wrap">
            {mix.map((m) => (
              <span key={m.label} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.dot }} /> {m.count} {m.label.toLowerCase()}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 3. Devis en attente — mini-courbe de tendance */}
        <motion.div {...cardMotion(2)} className="bg-white border border-black/5 rounded-lg p-5 sm:p-6 hover:shadow-card transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-muted">Devis en attente</span>
            <span className="w-9 h-9 rounded-lg bg-[#e6eef8] flex items-center justify-center shrink-0">
              <FileText size={16} className="text-blue" />
            </span>
          </div>
          <div className="font-display font-extrabold text-[26px] sm:text-[32px] text-navy mt-2">
            <CountUp value={nouveauxDevis} />
          </div>
          <div className="mt-1.5">
            <Sparkline values={pendingQuotesTrend} color="#2B5AA0" height={34} />
          </div>
          <div className="text-[11.5px] text-muted mt-1">
            {quotes.length ? `${Math.round((nouveauxDevis / quotes.length) * 100)}% des devis reçus` : "—"}
          </div>
        </motion.div>

        {/* 4. Taux de conversion — jauge directement dans la carte */}
        <motion.div {...cardMotion(3)} className="bg-white border border-black/5 rounded-lg p-5 sm:p-6 hover:shadow-card transition-shadow duration-300">
          <span className="text-[13px] text-muted">Taux de conversion</span>
          <div className="flex items-center gap-3 mt-1">
            <ConversionGauge percent={tauxConversion} />
            <div>
              <div className="font-display font-extrabold text-[26px] text-navy leading-none">{tauxConversion}%</div>
              <div className="text-[11.5px] text-muted mt-1.5 leading-snug">
                {quotes.filter((q) => q.status === "Accepté").length} acceptés sur {quotes.length}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 bg-white border border-black/5 rounded-lg p-5 sm:p-6 admin-fade-up" style={{ animationDelay: "0.3s" }}>
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
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-3.5 text-[12px] text-muted">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-3.5 h-0.5 rounded-sm bg-blue" /> 2025–2026
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-3.5 h-0 border-t-2 border-dashed border-[#9DB4D3]" /> Année précédente
                </span>
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
          </div>
          <div className="mt-3">
            <RevenueLineChart months={months} current={current} previous={previous} />
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-lg p-5 sm:p-6 admin-fade-up" style={{ animationDelay: "0.38s" }}>
          <h2 className="text-navy font-semibold text-sm">Répartition par pôle</h2>
          <div className="text-xs text-muted mt-1 mb-2">Part du budget cumulé des chantiers</div>
          <PoleDonutChart segments={poleSegments} totalLabel={`${poleTotal}M`} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="bg-white border border-black/5 rounded-lg p-5 sm:p-6 admin-fade-up" style={{ animationDelay: "0.44s" }}>
          <h2 className="text-navy font-semibold text-sm">Pipeline des devis</h2>
          <div className="text-xs text-muted mt-1">{quotes.length} demandes reçues</div>
          <div className="flex flex-col gap-4 mt-5">
            {pipeline.map(({ status, count }, i) => (
              <div key={status}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="text-ink font-medium">{status}</span>
                  <span className="font-bold text-navy">{count}</span>
                </div>
                <div className="h-2.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-[1100ms] ease-out"
                    style={{
                      width: ready ? `${(count / maxPipeline) * 100}%` : "0%",
                      background: pipelineColors[status],
                      transitionDelay: `${i * 0.12}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-lg overflow-hidden admin-fade-up" style={{ animationDelay: "0.5s" }}>
          <div className="px-5 sm:px-6 py-4 border-b border-black/5 flex items-center justify-between">
            <h2 className="text-navy font-semibold text-sm">Derniers devis</h2>
            <Link to="/admin/devis" className="text-blue text-xs font-semibold flex items-center gap-1 hover:underline">
              Voir tout <ArrowRight size={13} />
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {recentQuotes.map((q) => (
              <li key={q.id} className="px-5 sm:px-6 py-3 flex items-center gap-3 hover:bg-surface transition-colors">
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

        <div className="bg-white border border-black/5 rounded-lg p-5 sm:p-6 admin-fade-up" style={{ animationDelay: "0.56s" }}>
          <h2 className="text-navy font-semibold text-sm mb-4">Activité récente</h2>
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

      <div className="bg-white border border-black/5 rounded-lg overflow-hidden admin-fade-up" style={{ animationDelay: "0.62s" }}>
        <div className="px-5 sm:px-6 py-4 border-b border-black/5 flex items-center justify-between flex-wrap gap-2">
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
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-black/5 hover:bg-surface transition-colors admin-fade-in">
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
                          className={`h-full rounded-full ${progressBarClass(p.progress)} transition-[width] duration-[1200ms] ease-out`}
                          style={{ width: ready ? `${p.progress}%` : "0%" }}
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
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted text-sm">
                    Aucun chantier ne correspond à cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
