import { useState } from "react";
import { Pencil, Trash2, Download, Phone, Mail, MapPin } from "lucide-react";
import { clients as initialClients } from "../../data/adminData";
import { projects, statusStyles } from "../../data/projects";
import Modal from "../../components/admin/Modal";
import Avatar from "../../components/admin/Avatar";
import { exportToCsv } from "../../utils/exportCsv";
import { useAdminHeaderActions } from "./AdminHeaderContext";
import { useAdminToast } from "./AdminToastContext";

const csvColumns = [
  { key: "name", label: "Client" },
  { key: "type", label: "Type" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "Téléphone" },
  { key: "projectsCount", label: "Chantiers" },
  { key: "totalValue", label: "Valeur totale" },
];

// Gestion locale (en mémoire) — à connecter à une API back-end pour la persistance réelle.

const types = ["Particulier", "Entreprise", "Institution"];
const typeStyles = {
  Particulier: "bg-[#E6EEF8] text-blue",
  Entreprise: "bg-[#FDF1DC] text-[#A8650F]",
  Institution: "bg-[#E7F3DA] text-green-dark",
};

const emptyForm = { name: "", type: "Particulier", city: "", email: "", phone: "", projectsCount: 0, totalValue: "" };
const inputClass =
  "w-full mt-1.5 border border-black/10 rounded-md px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green/25 focus:border-green";
const labelClass = "text-xs font-semibold text-muted";

export default function AdminClients() {
  const showToast = useAdminToast();
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(clients[0]?.id ?? null);

  const filters = ["Tous", ...types];
  const filtered = clients.filter((c) => {
    const matchesSearch = (c.name + (c.city || "")).toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "Tous" || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const selected = clients.find((c) => c.id === selectedId) || null;
  const selectedProjects = selected ? projects.filter((p) => (selected.projectIds || []).includes(p.id)) : [];

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm(c);
    setModalOpen(true);
  };

  const remove = (id, name) => {
    if (window.confirm("Supprimer ce client ?")) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      setSelectedId((s) => (s === id ? null : s));
      showToast(`« ${name} » supprimé.`);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (editingId) {
      setClients((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form, projectsCount: Number(form.projectsCount) } : c)));
      showToast(`« ${form.name} » mis à jour.`);
    } else {
      const id = `c-${Date.now()}`;
      setClients((prev) => [...prev, { ...form, id, projectsCount: Number(form.projectsCount), projectIds: [] }]);
      setSelectedId(id);
      showToast(`« ${form.name} » ajouté aux clients.`);
    }
    setModalOpen(false);
  };

  // En-tête commun : recherche + bouton "Nouveau client".
  useAdminHeaderActions({
    showSearch: true,
    searchValue: search,
    onSearchChange: setSearch,
    searchPlaceholder: "Rechercher un client…",
    newLabel: "Nouveau client",
    onNew: openAdd,
  });

  return (
    <div className="flex flex-wrap items-start gap-6 admin-fade-up">
      <div className="flex-1 min-w-[480px] bg-white border border-black/5 rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-black/5">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const count = f === "Tous" ? clients.length : clients.filter((c) => c.type === f).length;
              const active = typeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                    active ? "bg-navy text-white border-navy" : "text-muted border-black/10 hover:border-navy/40"
                  }`}
                >
                  {f} <span className="opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => exportToCsv("clients-mn3j-group.csv", filtered, csvColumns)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-navy border border-black/10 px-4 py-2 rounded-md hover:border-navy/40 transition-colors shrink-0"
          >
            <Download size={14} /> Exporter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-muted uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Chantiers</th>
                <th className="px-5 py-3 font-medium">CA cumulé</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`border-t border-black/5 cursor-pointer transition-colors ${
                    selectedId === c.id ? "bg-green/10" : "hover:bg-surface"
                  }`}
                >
                  <td className="px-5 py-3 font-medium text-navy">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} />
                      <div className="min-w-0">
                        <div className="truncate">{c.name}</div>
                        {c.city && <div className="text-[11.5px] text-muted font-normal truncate">{c.city}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${typeStyles[c.type] || "bg-black/5 text-muted"}`}>
                      {c.type || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted font-semibold">{c.projectsCount}</td>
                  <td className="px-5 py-3 text-navy font-bold whitespace-nowrap">{c.totalValue}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="text-blue hover:text-navy" aria-label="Modifier">
                        <Pencil size={15} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); remove(c.id, c.name); }} className="text-red-500 hover:text-red-700" aria-label="Supprimer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted text-sm">
                    Aucun client ne correspond à cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="flex-1 min-w-[280px] max-w-sm bg-white border border-black/5 rounded-lg p-6 sticky top-24">
          <div className="flex items-center gap-3.5">
            <span className="w-14 h-14 rounded-full bg-navy/5 text-navy font-display font-bold text-lg flex items-center justify-center shrink-0">
              {selected.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="font-display font-bold text-navy text-base">{selected.name}</div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block ${typeStyles[selected.type] || "bg-black/5 text-muted"}`}>
                {selected.type || "—"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-surface rounded-md p-3">
              <div className="text-[11.5px] text-muted">Chantiers</div>
              <div className="font-display font-extrabold text-xl text-navy mt-0.5">{selected.projectsCount}</div>
            </div>
            <div className="bg-surface rounded-md p-3">
              <div className="text-[11.5px] text-muted">CA cumulé</div>
              <div className="font-display font-extrabold text-lg text-navy mt-0.5 whitespace-nowrap">{selected.totalValue}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mt-5 text-sm text-ink">
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-blue shrink-0" /> {selected.phone}
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-blue shrink-0" /> {selected.email}
            </div>
            {selected.city && (
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-blue shrink-0" /> {selected.city}, Cameroun
              </div>
            )}
          </div>

          <div className="text-[11px] font-semibold tracking-wide text-muted mt-5">CHANTIERS ASSOCIÉS</div>
          <div className="flex flex-col gap-2 mt-2.5">
            {selectedProjects.map((p) => (
              <div key={p.id} className="flex justify-between items-center gap-2.5 px-3 py-2.5 border border-black/5 rounded-md">
                <span className="text-[13px] font-semibold text-navy truncate">{p.name}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyles[p.status]}`}>
                  {p.status}
                </span>
              </div>
            ))}
            {selectedProjects.length === 0 && <p className="text-xs text-muted">Aucun chantier associé pour l'instant.</p>}
          </div>

          <div className="flex gap-2.5 mt-5">
            <a
              href={selected.phone !== "À préciser" ? `tel:${selected.phone}` : undefined}
              aria-disabled={selected.phone === "À préciser"}
              className={`flex-1 text-center font-bold text-sm py-2.5 rounded-md transition-colors ${
                selected.phone === "À préciser"
                  ? "bg-black/5 text-muted cursor-not-allowed pointer-events-none"
                  : "bg-green text-[#12310F] hover:bg-green-dark hover:text-white"
              }`}
            >
              Appeler
            </a>
            <a
              href={selected.email !== "À préciser" ? `mailto:${selected.email}` : undefined}
              aria-disabled={selected.email === "À préciser"}
              className={`flex-1 text-center font-bold text-sm py-2.5 rounded-md border transition-colors ${
                selected.email === "À préciser"
                  ? "border-black/10 text-muted cursor-not-allowed pointer-events-none"
                  : "border-navy text-navy hover:bg-navy hover:text-white"
              }`}
            >
              Envoyer un e-mail
            </a>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Modifier le client" : "Ajouter un client"}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Nom</label>
            <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select className={`${inputClass} bg-white`} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Ville</label>
            <input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>E-mail</label>
            <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Téléphone</label>
            <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nb. de chantiers</label>
              <input type="number" min={0} className={inputClass} value={form.projectsCount} onChange={(e) => setForm({ ...form, projectsCount: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Valeur totale</label>
              <input className={inputClass} value={form.totalValue} onChange={(e) => setForm({ ...form, totalValue: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="text-sm font-semibold text-muted px-4 py-2.5">
              Annuler
            </button>
            <button type="submit" className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-navy-dark transition-colors">
              {editingId ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
