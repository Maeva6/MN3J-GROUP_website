import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { projects as initialProjects, statusStyles } from "../../data/projects";
import Modal from "../../components/admin/Modal";

// Gestion locale (en mémoire) — les chantiers ajoutés/modifiés ici ne sont pas
// persistés côté serveur. À connecter à une vraie API back-end pour que ces
// changements survivent au rechargement de la page.

const statuses = ["Réalisé", "En cours", "Planifié"];

const emptyForm = {
  name: "",
  category: "",
  location: "",
  status: "En cours",
  progress: 0,
  client: "",
  year: new Date().getFullYear().toString(),
  duration: "",
  description: "",
  image: null,
};

const inputClass = "w-full mt-1 border border-black/10 rounded-md px-3 py-2 text-sm";
const labelClass = "text-xs font-semibold text-muted";

export default function AdminChantiers() {
  const [chantiers, setChantiers] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = chantiers.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p, progress: p.progress ?? 0 });
    setModalOpen(true);
  };

  const remove = (id) => {
    if (window.confirm("Supprimer ce chantier ?")) {
      setChantiers((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (editingId) {
      setChantiers((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form, progress: Number(form.progress) } : p)));
    } else {
      const id = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `chantier-${Date.now()}`;
      setChantiers((prev) => [...prev, { ...form, id, progress: Number(form.progress) }]);
    }
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un chantier…"
              className="pl-9 pr-4 py-2 text-sm border border-black/10 rounded-md w-56"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-black/10 rounded-md px-3 py-2 bg-white"
          >
            <option value="all">Tous les statuts</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-navy text-white text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-navy-dark transition-colors"
        >
          <Plus size={14} /> Ajouter un chantier
        </button>
      </div>

      <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5">
          <h2 className="text-navy font-semibold text-sm">Liste des chantiers ({filtered.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Chantier</th>
              <th className="px-6 py-3 font-medium">Catégorie</th>
              <th className="px-6 py-3 font-medium">Statut</th>
              <th className="px-6 py-3 font-medium">Progression</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="px-6 py-3 font-medium text-navy">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt="" className="w-9 h-9 rounded object-cover shrink-0" />}
                    {p.name}
                  </div>
                </td>
                <td className="px-6 py-3 text-muted">{p.category}</td>
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
                <td className="px-6 py-3 text-muted">{p.client}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(p)} className="text-blue hover:text-navy" aria-label="Modifier">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(p.id)} className="text-red-500 hover:text-red-700" aria-label="Supprimer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted text-sm">
                  Aucun chantier ne correspond à cette recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Modifier le chantier" : "Ajouter un chantier"} wide>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom du chantier</label>
            <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Catégorie</label>
            <input required className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Localisation</label>
            <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Client</label>
            <input className={inputClass} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Statut</label>
            <select className={`${inputClass} bg-white`} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Progression (%)</label>
            <input type="number" min={0} max={100} className={inputClass} value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Année</label>
            <input className={inputClass} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Durée</label>
            <input className={inputClass} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea rows={3} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Photo</label>
            <input type="file" accept="image/*" onChange={handleFile} className="block mt-1 text-sm" />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="text-sm font-semibold text-muted px-4 py-2.5">
              Annuler
            </button>
            <button type="submit" className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-navy-dark transition-colors">
              {editingId ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
