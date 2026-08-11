import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { quotes as initialQuotes, quoteStatuses, quoteStatusStyles } from "../../data/adminData";
import Modal from "../../components/admin/Modal";

// Gestion locale (en mémoire) — à connecter au formulaire de contact réel et à
// une API back-end pour la persistance (voir TODO dans src/pages/Contact.jsx).

const tabs = ["Tous", ...quoteStatuses];

export default function AdminDevis() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [tab, setTab] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const filtered = tab === "Tous" ? quotes : quotes.filter((q) => q.status === tab);

  const updateStatus = (id, status) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  };

  const remove = (id) => {
    if (window.confirm("Supprimer cette demande de devis ?")) {
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      setSelected((s) => (s && s.id === id ? null : s));
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tName) => (
          <button
            key={tName}
            onClick={() => setTab(tName)}
            className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
              tab === tName ? "bg-navy text-white border-navy" : "text-muted border-black/10 hover:border-navy/40"
            }`}
          >
            {tName}
            {tName !== "Tous" && ` (${quotes.filter((q) => q.status === tName).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5">
          <h2 className="text-navy font-semibold text-sm">Demandes de devis ({filtered.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Nom</th>
              <th className="px-6 py-3 font-medium">Type de projet</th>
              <th className="px-6 py-3 font-medium">Budget</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Statut</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => (
              <tr key={q.id} className="border-t border-black/5">
                <td className="px-6 py-3 font-medium text-navy">{q.name}</td>
                <td className="px-6 py-3 text-muted">{q.projectType}</td>
                <td className="px-6 py-3 text-muted">{q.budget}</td>
                <td className="px-6 py-3 text-muted">{q.date}</td>
                <td className="px-6 py-3">
                  <select
                    value={q.status}
                    onChange={(e) => updateStatus(q.id, e.target.value)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-0 ${quoteStatusStyles[q.status]}`}
                  >
                    {quoteStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelected(q)} className="text-blue hover:text-navy" aria-label="Voir">
                      <Eye size={15} />
                    </button>
                    <button onClick={() => remove(q.id)} className="text-red-500 hover:text-red-700" aria-label="Supprimer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted text-sm">
                  Aucune demande de devis dans cette catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Détail de la demande">
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Nom</span>
              <span className="font-medium text-navy">{selected.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">E-mail</span>
              <span className="font-medium text-navy">{selected.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Téléphone</span>
              <span className="font-medium text-navy">{selected.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Type de projet</span>
              <span className="font-medium text-navy">{selected.projectType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Budget</span>
              <span className="font-medium text-navy">{selected.budget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Date</span>
              <span className="font-medium text-navy">{selected.date}</span>
            </div>
            <div>
              <span className="text-muted block mb-1">Message</span>
              <p className="text-ink bg-surface rounded-md p-3">{selected.message}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
