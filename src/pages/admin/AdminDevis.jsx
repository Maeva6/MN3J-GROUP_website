import { useState } from "react";
import { Trash2, Download } from "lucide-react";
import { quotes as initialQuotes, quoteStatuses, quoteStatusStyles } from "../../data/adminData";
import Modal from "../../components/admin/Modal";
import Avatar from "../../components/admin/Avatar";
import { exportToCsv } from "../../utils/exportCsv";
import { useAdminHeaderActions } from "./AdminHeaderContext";
import { useAdminToast } from "./AdminToastContext";

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

// Mêmes libellés que le formulaire de devis public (src/i18n/fr.js →
// contact.projectTypes / contact.budgetOptions), pour que les devis saisis
// manuellement ici restent cohérents avec ceux reçus via le site.
const projectTypes = ["Piscine haut de gamme", "Décoration", "BTP & finitions", "Formation aquatique"];
const budgetOptions = ["Moins de 5M FCFA", "5M – 15M FCFA", "15M – 40M FCFA", "Plus de 40M FCFA"];

const emptyForm = { name: "", email: "", phone: "", projectType: projectTypes[0], budget: budgetOptions[0], message: "" };
const inputClass =
  "w-full mt-1.5 border border-black/10 rounded-md px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green/25 focus:border-green";
const labelClass = "text-xs font-semibold text-muted";

export default function AdminDevis() {
  const showToast = useAdminToast();
  const [quotes, setQuotes] = useState(initialQuotes);
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [draggedId, setDraggedId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const updateStatus = (id, status, { silent } = {}) => {
    const q = quotes.find((x) => x.id === id);
    setQuotes((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
    if (!silent && q && q.status !== status) showToast(`Devis de ${q.name} déplacé vers « ${status} ».`);
  };

  const remove = (id) => {
    const q = quotes.find((x) => x.id === id);
    if (window.confirm("Supprimer cette demande de devis ?")) {
      setQuotes((prev) => prev.filter((x) => x.id !== id));
      setSelected((s) => (s && s.id === id ? null : s));
      if (q) showToast(`Devis de ${q.name} supprimé.`);
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setAddOpen(true);
  };

  const submitAdd = (e) => {
    e.preventDefault();
    const id = `m${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    setQuotes((prev) => [{ ...form, id, status: "Nouveau", date: today }, ...prev]);
    setAddOpen(false);
    showToast(`Devis de ${form.name} ajouté.`);
  };

  // En-tête commun : bouton "Nouveau devis".
  useAdminHeaderActions({ newLabel: "Nouveau devis", onNew: openAdd });

  const stats = quoteStatuses.map((status) => ({
    status,
    count: quotes.filter((q) => q.status === status).length,
  }));

  return (
    <>
      {/* Le fondu d'entrée reste sur ce conteneur, pas sur la racine (voir le
          même commentaire dans AdminChantiers.jsx) : les Modal ci-dessous sont
          en position fixed. Les cartes du Kanban n'ont pas leur propre
          animation d'entrée : elles portent déjà une opacité inline pendant
          le glisser-déposer, qu'une animation CSS sur la même propriété
          écraserait. */}
      <div className="space-y-6 admin-fade-up">
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Nouveau devis" wide>
        <form onSubmit={submitAdd} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom du client</label>
            <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Téléphone</label>
            <input required className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>E-mail</label>
            <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Type de projet</label>
            <select className={`${inputClass} bg-white`} value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })}>
              {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Budget estimé</label>
            <select className={`${inputClass} bg-white`} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
              {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Message / besoin exprimé</label>
            <textarea rows={3} className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="text-sm font-semibold text-muted px-4 py-2.5">
              Annuler
            </button>
            <button type="submit" className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-navy-dark transition-colors">
              Ajouter
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
