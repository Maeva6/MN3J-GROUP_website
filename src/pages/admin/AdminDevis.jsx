import { useState } from "react";
import { Trash2, Download } from "lucide-react";
import { quotes as initialQuotes, quoteStatuses, quoteStatusStyles } from "../../data/adminData";
import Modal from "../../components/admin/Modal";
import Avatar from "../../components/admin/Avatar";
import { exportToCsv } from "../../utils/exportCsv";

const csvColumns = [
  { key: "name", label: "Nom" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "Téléphone" },
  { key: "projectType", label: "Type de projet" },
  { key: "budget", label: "Budget" },
  { key: "date", label: "Date" },
  { key: "status", label: "Statut" },
];

// Gestion locale (en mémoire) — à connecter au formulaire de contact réel et à
// une API back-end pour la persistance (voir TODO dans src/pages/Contact.jsx).

const columnColors = {
  "Nouveau": "#2B5AA0",
  "Contacté": "#E6A23C",
  "Accepté": "#7DBF3F",
  "Refusé": "#d26a5c",
};

export default function AdminDevis() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [selected, setSelected] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [overCol, setOverCol] = useState(null);

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

  const stats = quoteStatuses.map((status) => ({
    status,
    count: quotes.filter((q) => q.status === status).length,
  }));

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.status} className="bg-white border border-black/5 rounded-lg p-5 flex items-center gap-3.5">
            <span className="w-2.5 h-9 rounded shrink-0" style={{ background: columnColors[s.status] }} />
            <div>
              <div className="text-xs text-muted">{s.status}</div>
              <div className="text-xl font-display font-extrabold text-navy mt-0.5">{s.count}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-muted flex items-center gap-2">
          Glissez une carte d'une colonne à l'autre pour changer le statut d'un devis.
        </p>
        <button
          onClick={() => exportToCsv("devis-mn3j-group.csv", quotes, csvColumns)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy border border-black/10 px-4 py-2 rounded-full hover:border-navy/40 transition-colors shrink-0"
        >
          <Download size={14} /> Exporter
        </button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-4 gap-4 min-w-[960px]">
          {quoteStatuses.map((status) => {
            const cards = quotes.filter((q) => q.status === status);
            const isOver = overCol === status;
            return (
              <div
                key={status}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (overCol !== status) setOverCol(status);
                }}
                onDragLeave={() => setOverCol((c) => (c === status ? null : c))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedId) updateStatus(draggedId, status);
                  setDraggedId(null);
                  setOverCol(null);
                }}
                className={`rounded-lg p-3.5 min-h-[420px] border-2 border-dashed transition-colors ${
                  isOver ? "bg-green/10 border-green" : "bg-surface border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 px-1 pb-3.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: columnColors[status] }} />
                  <span className="font-display font-semibold text-sm text-navy">{status}</span>
                  <span className="text-[11px] font-bold bg-white text-muted px-2 py-0.5 rounded-full">{cards.length}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {cards.map((q) => (
                    <div
                      key={q.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        setDraggedId(q.id);
                      }}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setOverCol(null);
                      }}
                      onClick={() => setSelected(q)}
                      className="bg-white border border-black/5 rounded-md p-3.5 cursor-grab active:cursor-grabbing hover:shadow-card transition-shadow"
                      style={{ opacity: draggedId === q.id ? 0.4 : 1 }}
                    >
                      <div className="flex justify-between text-[11px] text-muted">
                        <span className="font-semibold">DV-{q.id}</span>
                        <span>{q.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar name={q.name} size="sm" />
                        <span className="text-sm font-semibold text-ink truncate">{q.name}</span>
                      </div>
                      <span className="inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-navy/5 text-navy">
                        {q.projectType}
                      </span>
                      <div className="text-[12px] text-muted mt-2.5 pt-2.5 border-t border-black/5 truncate">{q.budget}</div>
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <div className="border-2 border-dashed border-black/10 rounded-md py-6 text-center text-[12.5px] text-muted">
                      Déposez un devis ici
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
            <div className="flex justify-between items-center">
              <span className="text-muted">Statut</span>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-0 ${quoteStatusStyles[selected.status]}`}
              >
                {quoteStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Date</span>
              <span className="font-medium text-navy">{selected.date}</span>
            </div>
            <div>
              <span className="text-muted block mb-1">Message</span>
              <p className="text-ink bg-surface rounded-md p-3">{selected.message}</p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => remove(selected.id)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#B3261E] hover:text-red-700"
              >
                <Trash2 size={14} /> Supprimer cette demande
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
