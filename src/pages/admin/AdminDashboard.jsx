import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { projects, statusStyles } from "../../data/projects";
import { quotes, quoteStatusStyles } from "../../data/adminData";
import { clients } from "../../data/adminData";

export default function AdminDashboard() {
  const kpis = [
    { value: projects.length, label: "Chantiers au total" },
    { value: projects.filter((p) => p.status === "En cours").length, label: "En cours" },
    { value: quotes.filter((q) => q.status === "Nouveau").length, label: "Devis en attente" },
    { value: clients.length, label: "Clients" },
  ];

  const recentProjects = projects.slice(0, 5);
  const recentQuotes = quotes.slice(0, 4);

  return (
    <>
      <div className="grid md:grid-cols-4 gap-5">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-black/5 rounded-lg p-6">
            <div className="text-2xl font-display font-bold text-navy">{k.value}</div>
            <div className="text-xs text-muted mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-black/5 rounded-lg overflow-hidden">
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

        <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
            <h2 className="text-navy font-semibold text-sm">Derniers devis</h2>
            <Link to="/admin/devis" className="text-blue text-xs font-semibold flex items-center gap-1 hover:underline">
              Voir tout <ArrowRight size={13} />
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {recentQuotes.map((q) => (
              <li key={q.id} className="px-6 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-navy truncate">{q.name}</span>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${quoteStatusStyles[q.status]}`}>
                    {q.status}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{q.projectType}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
