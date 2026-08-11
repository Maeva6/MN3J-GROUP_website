import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { clients as initialClients } from "../../data/adminData";
import Modal from "../../components/admin/Modal";

// Gestion locale (en mémoire) — à connecter à une API back-end pour la persistance réelle.

const emptyForm = { name: "", email: "", phone: "", projectsCount: 0, totalValue: "" };
const inputClass = "w-full mt-1 border border-black/10 rounded-md px-3 py-2 text-sm";
const labelClass = "text-xs font-semibold text-muted";

export default function AdminClients() {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

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

  const remove = (id) => {
    if (window.confirm("Supprimer ce client ?")) {
      setClients((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (editingId) {
      setClients((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form, projectsCount: Number(form.projectsCount) } : c)));
    } else {
      setClients((prev) => [...prev, { ...form, id: `c-${Date.now()}`, projectsCount: Number(form.projectsCount) }]);
    }
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client…"
            className="pl-9 pr-4 py-2 text-sm border border-black/10 rounded-md w-56"
          />
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-navy text-white text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-navy-dark transition-colors"
        >
          <Plus size={14} /> Ajouter un client
        </button>
      </div>

      <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5">
          <h2 className="text-navy font-semibold text-sm">Liste des clients ({filtered.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
              <th className="px-6 py-3 font-medium">Téléphone</th>
              <th className="px-6 py-3 font-medium">Chantiers</th>
              <th className="px-6 py-3 font-medium">Valeur totale</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-black/5">
                <td className="px-6 py-3 font-medium text-navy">{c.name}</td>
                <td className="px-6 py-3 text-muted">{c.email}</td>
                <td className="px-6 py-3 text-muted">{c.phone}</td>
                <td className="px-6 py-3 text-muted">{c.projectsCount}</td>
                <td className="px-6 py-3 text-muted">{c.totalValue}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(c)} className="text-blue hover:text-navy" aria-label="Modifier">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(c.id)} className="text-red-500 hover:text-red-700" aria-label="Supprimer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted text-sm">
                  Aucun client ne correspond à cette recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Modifier le client" : "Ajouter un client"}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Nom</label>
            <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
    </>
  );
}
