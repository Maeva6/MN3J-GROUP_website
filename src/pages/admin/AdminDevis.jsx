import { useState } from "react";
import { Trash2, Download, ArrowLeftRight, Kanban, Table2, LayoutGrid } from "lucide-react";
import { quotes as initialQuotes, quoteStatuses, quoteStatusStyles } from "../../data/adminData";
import Modal from "../../components/admin/Modal";
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

// Les dates sont stockées en ISO ("2026-08-05") pour rester triables/export-
// ables ; affichées au format court "02 sept. 2026" sur les cartes et la fiche.
function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
}

const views = [
  { key: "kanban", label: "Kanban", icon: Kanban },
  { key: "tableau", label: "Tableau", icon: Table2 },
  { key: "cartes", label: "Cartes", icon: LayoutGrid },
];

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

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const inputClass =
  "w-full mt-1.5 border border-black/10 rounded-md px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green/25 focus:border-green";
const labelClass = "text-xs font-semibold text-muted";

export default function AdminDevis() {
  const showToast = useAdminToast();
  const [quotes, setQuotes] = useState(initialQuotes);
  const [view, setView] = useState("kanban");
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

  // Les 4 cartes de la maquette ("En négociation", "Montant signé", "Taux de
  // conversion", "Délai moyen de réponse") totalisent des montants en FCFA —
  // nos devis n'ont qu'une tranche de budget ("5M – 15M FCFA"), pas un
  // montant exact, donc impossible à additionner honnêtement. On garde les 3
  // cartes calculables (en comptant les devis plutôt qu'en sommant un montant
  // inventé) et on remplace "Délai moyen de réponse" — qu'on ne peut pas
  // mesurer sans horodatage réel — par le compte des devis refusés.
  const dvStats = [
    { label: "En négociation", value: quotes.filter((q) => q.status === "Nouveau" || q.status === "Contacté").length, color: "#2B5AA0" },
    { label: "Signés", value: quotes.filter((q) => q.status === "Accepté").length, color: "#7DBF3F" },
    {
      label: "Taux de conversion",
      value: `${quotes.length ? Math.round((quotes.filter((q) => q.status === "Accepté").length / quotes.length) * 100) : 0} %`,
      color: "#E6A23C",
    },
    { label: "Refusés", value: quotes.filter((q) => q.status === "Refusé").length, color: "#d26a5c" },
  ];

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
        {dvStats.map((s) => (
          <div key={s.label} className="bg-white border border-black/5 rounded-lg p-5 flex items-center gap-3.5 hover:shadow-card transition-shadow">
            <span className="w-2.5 h-9 rounded shrink-0" style={{ background: s.color }} />
            <div className="min-w-0">
              <div className="text-[12.5px] text-muted whitespace-nowrap">{s.label}</div>
              <div className="text-xl font-display font-extrabold text-navy mt-0.5 whitespace-nowrap">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 bg-surface border border-black/5 rounded-full p-1">
          {views.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                view === key ? "bg-navy text-white" : "text-muted hover:text-navy"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => exportToCsv("devis-mn3j-group.csv", quotes, csvColumns)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy border border-black/10 px-4 py-2 rounded-full hover:border-navy/40 transition-colors shrink-0"
        >
          <Download size={14} /> Exporter
        </button>
      </div>

      {view === "kanban" && (
        <p className="text-xs text-muted flex items-center gap-2 -mt-2">
          <ArrowLeftRight size={14} className="text-blue shrink-0" />
          Glissez une carte d'une colonne à l'autre pour changer le statut d'un devis.
        </p>
      )}

      {view === "kanban" && (
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
                  isOver ? "bg-green/10 border-green" : "bg-[#E9EDF1] border-transparent"
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
                        <span>{formatDate(q.date)}</span>
                      </div>
                      <div className="text-sm font-semibold text-ink mt-2 truncate">{q.name}</div>
                      <span className="inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-navy/5 text-navy">
                        {q.projectType}
                      </span>
                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-black/5">
                        <span className="font-display font-bold text-[13.5px] text-navy truncate">{q.budget}</span>
                        <span className="w-[26px] h-[26px] rounded-full bg-[#E6EEF8] text-navy flex items-center justify-center font-display font-bold text-[10px] shrink-0">
                          {initials(q.name)}
                        </span>
                      </div>
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
      )}

      {view === "tableau" && (
        <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs text-muted uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Type de projet</th>
                  <th className="px-5 py-3 font-medium">Budget</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr
                    key={q.id}
                    onClick={() => setSelected(q)}
                    className="border-t border-black/5 cursor-pointer hover:bg-surface transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-navy">
                      <div className="flex items-center gap-3">
                        <span className="w-[26px] h-[26px] rounded-full bg-[#E6EEF8] text-navy flex items-center justify-center font-display font-bold text-[10px] shrink-0">
                          {initials(q.name)}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate">{q.name}</div>
                          <div className="text-[11px] text-muted font-normal">DV-{q.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink">{q.projectType}</td>
                    <td className="px-5 py-3 font-semibold text-navy whitespace-nowrap">{q.budget}</td>
                    <td className="px-5 py-3 text-muted whitespace-nowrap">{formatDate(q.date)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${quoteStatusStyles[q.status]}`}>{q.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(q.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {quotes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-muted text-sm">
                      Aucune demande de devis pour l'instant.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "cartes" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((q) => (
            <div
              key={q.id}
              onClick={() => setSelected(q)}
              className="bg-white border border-black/5 rounded-lg p-4 cursor-pointer hover:shadow-card hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted">DV-{q.id}</span>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${quoteStatusStyles[q.status]}`}>{q.status}</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="w-9 h-9 rounded-full bg-[#E6EEF8] text-navy flex items-center justify-center font-display font-bold text-xs shrink-0">
                  {initials(q.name)}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink truncate">{q.name}</div>
                  <div className="text-[12px] text-muted truncate">{q.projectType}</div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3.5 pt-3 border-t border-black/5">
                <span className="font-display font-bold text-[13.5px] text-navy truncate">{q.budget}</span>
                <span className="text-xs text-muted whitespace-nowrap">{formatDate(q.date)}</span>
              </div>
            </div>
          ))}
          {quotes.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 bg-white border border-black/5 rounded-lg p-10 text-center text-muted text-sm">
              Aucune demande de devis pour l'instant.
            </div>
          )}
        </div>
      )}
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
              <span className="font-medium text-navy">{formatDate(selected.date)}</span>
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
