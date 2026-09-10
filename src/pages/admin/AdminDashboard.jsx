import { Link } from "react-router-dom";
import { ArrowRight, HardHat, Clock, FileText, Users } from "lucide-react";
import { projects, statusStyles } from "../../data/projects";
import { quotes, quoteStatuses, quoteStatusStyles } from "../../data/adminData";
import { clients } from "../../data/adminData";
import Avatar from "../../components/admin/Avatar";

// Couleurs pleines pour les barres du mini-graphique (les couleurs de
// quoteStatusStyles sont des teintes pastel pensées pour des badges texte,
// trop claires pour remplir une barre lisiblement).
const statusBarColors = {
  "Nouveau": "bg-blue",
  "Contacté": "bg-[#A8650F]",
  "Accepté": "bg-green-dark",
  "Refusé": "bg-[#B3261E]",
};

function parseFcfa(value) {
  return Number(String(value).replace(/[^\d]/g, "")) || 0;
}

function ConversionGauge({ percent }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="#EEF1F4" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#7DBF3F"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
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

export default function AdminDashboard() {
  const enCours = projects.filter((p) => p.status === "En cours").length;
  const nouveauxDevis = quotes.filter((q) => q.status === "Nouveau").length;
  const totalValeurClients = clients.reduce((sum, c) => sum + parseFcfa(c.totalValue), 0);
  const tauxConversion = quotes.length
    ? Math.round((quotes.filter((q) => q.status === "Accepté").length / quotes.length) * 100)
    : 0;

  const kpis = [
    {
      icon: HardHat,
      value: projects.length,
      label: "Chantiers au total",
      sub: `${enCours} en cours`,
      highlight: true,
    },
    {
      icon: Clock,
      value: enCours,
      label: "En cours",
      sub: projects.length ? `${Math.round((enCours / projects.length) * 100)}% du total` : "—",
    },
    {
      icon: FileText,
      value: nouveauxDevis,
      label: "Devis en attente",
      sub: quotes.length ? `${Math.round((nouveauxDevis / quotes.length) * 100)}% des devis reçus` : "—",
    },
    {
      icon: Users,
      value: clients.length,
      label: "Clients",
      sub: `${totalValeurClients.toLocaleString("fr-FR")} FCFA cumulés`,
    },
  ];

  const statusCounts = quoteStatuses.map((s) => ({
    status: s,
    count: quotes.filter((q) => q.status === s).length,
  }));
  const maxCount = Math.max(1, ...statusCounts.map((s) => s.count));

  const recentProjects = projects.slice(0, 5);
  const recentQuotes = quotes.slice(0, 4);

  return (
    <>
      <div className="grid md:grid-cols-4 gap-5">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`rounded-lg p-6 ${
              k.highlight ? "bg-navy text-white" : "bg-white border border-black/5"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                k.highlight ? "bg-white/15" : "bg-navy/5"
              }`}
            >
              <k.icon size={16} className={k.highlight ? "text-white" : "text-navy"} />
            </div>
            <div className={`text-2xl font-display font-bold ${k.highlight ? "text-white" : "text-navy"}`}>
              {k.value}
            </div>
            <div className={`text-xs mt-1 ${k.highlight ? "text-white/70" : "text-muted"}`}>{k.label}</div>
            <div
              className={`text-[11px] font-semibold mt-2 inline-block px-2 py-0.5 rounded-full ${
                k.highlight ? "bg-white/15 text-white" : "bg-green/15 text-green-dark"
              }`}
            >
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white border border-black/5 rounded-lg p-6">
          <h2 className="text-navy font-semibold text-sm mb-6">Devis par statut</h2>
          <div className="flex items-end justify-between gap-3 h-32">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <span className="text-xs font-semibold text-navy">{count}</span>
                <div className="w-full flex items-end justify-center h-full">
                  <div
                    className={`w-full max-w-[32px] rounded-t-md ${statusBarColors[status]}`}
                    style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? 6 : 0 }}
                  />
                </div>
                <span className="text-[10px] text-muted text-center leading-tight">{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-navy font-semibold text-sm mb-4 self-start">Taux de conversion devis</h2>
          <ConversionGauge percent={tauxConversion} />
          <p className="text-xs text-muted mt-3">
            {quotes.filter((q) => q.status === "Accepté").length} devis acceptés sur {quotes.length}
          </p>
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
              <li key={q.id} className="px-6 py-3 flex items-center gap-3">
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
      </div>

      <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-navy font-semibold text-sm">Chantiers récents</h2>
          <Link to="/admin/chantiers" className="text-blue text-xs font-semibold flex items-center gap-1 hover:underline">
            Voir tout <ArrowRight size={13} />
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Chantier</th>
              <th className="px-6 py-3 font-medium">Statut</th>
              <th className="px-6 py-3 font-medium">Progression</th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="px-6 py-3 font-medium text-navy">{p.name}</td>
                <td className="px-6 py-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusStyles[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="w-28 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
