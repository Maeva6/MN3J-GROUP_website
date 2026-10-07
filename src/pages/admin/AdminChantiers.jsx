import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Download, MapPin, Calendar } from "lucide-react";
import { projects as initialProjects, statusStyles, progressBarClass } from "../../data/projects";
import { projectExtras, projectSteps, teamMembers } from "../../data/adminData";
import Modal from "../../components/admin/Modal";
import Drawer from "../../components/admin/Drawer";
import { exportToCsv } from "../../utils/exportCsv";
import { useAdminHeaderActions } from "./AdminHeaderContext";

const csvColumns = [
  { key: "name", label: "Chantier" },
  { key: "category", label: "Catégorie" },
  { key: "status", label: "Statut" },
  { key: "progress", label: "Progression (%)" },
  { key: "client", label: "Client" },
  { key: "location", label: "Localisation" },
  { key: "year", label: "Année" },
];

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
  const navigate = useNavigate();
  const location = useLocation();
  const [chantiers, setChantiers] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [openId, setOpenId] = useState(null);

  const filters = ["Tous", ...statuses];
  const filtered = chantiers.filter((p) => {
    const matchesSearch = (p.name + p.location + p.client).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "Tous" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  // En-tête commun : recherche + bouton "Nouveau chantier".
  useAdminHeaderActions({
    showSearch: true,
    searchValue: search,
    onSearchChange: setSearch,
    searchPlaceholder: "Rechercher un chantier…",
    newLabel: "Nouveau chantier",
    onNew: openAdd,
  });

  // Arrivée depuis le tableau de bord ("Nouveau chantier") : ouvre directement
  // le formulaire d'ajout.
  useEffect(() => {
    if (location.state?.openAdd) {
      openAdd();
      navigate(".", { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p, progress: p.progress ?? 0 });
    setModalOpen(true);
  };

  const remove = (id) => {
    if (window.confirm("Supprimer ce chantier ?")) {
      setChantiers((prev) => prev.filter((p) => p.id !== id));
      setOpenId((o) => (o === id ? null : o));
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

  const patch = (id, fields) => {
    setChantiers((prev) => prev.map((p) => (p.id === id ? { ...p, ...fields } : p)));
  };

  const onStatusChange = (p, status) => {
    const progress =
      status === "Réalisé" ? 100 : status === "Planifié" ? 0 : Math.min(95, Math.max(5, p.progress || 5));
    patch(p.id, { status, progress });
  };

  const onProgressChange = (p, progress) => {
    const status = progress >= 100 ? "Réalisé" : progress <= 0 ? "Planifié" : "En cours";
    patch(p.id, { progress, status });
  };

  const open = chantiers.find((p) => p.id === openId) || null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const count = f === "Tous" ? chantiers.length : chantiers.filter((p) => p.status === f).length;
            const active = statusFilter === f;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
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
          onClick={() => exportToCsv("chantiers-mn3j-group.csv", filtered, csvColumns)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy border border-black/10 px-4 py-2.5 rounded-md hover:border-navy/40 transition-colors shrink-0"
        >
          <Download size={14} /> Exporter
        </button>
      </div>

      <div className="text-xs text-muted -mt-2">{filtered.length} chantier{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""} · cliquez sur une carte pour la modifier</div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((p) => {
          const team = projectExtras[p.id]?.team || [];
          const due = projectExtras[p.id]?.dueLabel;
          return (
            <div
              key={p.id}
              onClick={() => setOpenId(p.id)}
              className="group bg-white border border-black/5 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="relative h-36">
                {p.image ? (
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy to-blue" />
                )}
                <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${statusStyles[p.status]}`}>
                  {p.status}
                </span>
                <span className="absolute bottom-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-navy">
                  {p.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(p.id);
                  }}
                  aria-label="Supprimer"
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 text-[#B3261E] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="p-4">
                <div className="font-display font-semibold text-[15px] text-navy truncate">{p.name}</div>
                <div className="text-[12.5px] text-muted mt-1 flex items-center gap-1 truncate">
                  <MapPin size={11} className="shrink-0" /> {p.location} · {p.client}
                </div>
                <div className="flex items-center gap-2.5 mt-3.5">
                  <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${progressBarClass(p.progress)}`} style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-navy">{p.progress}%</span>
                </div>
                <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-black/5">
                  <div className="flex -space-x-1.5">
                    {team.map((i) => (
                      <span
                        key={i}
                        className={`w-6 h-6 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center ${teamMembers[i]?.bg || "bg-navy-light"}`}
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                  {due && (
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Calendar size={12} /> {due}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 xl:col-span-3 bg-white border border-black/5 rounded-lg p-10 text-center text-muted text-sm">
            Aucun chantier ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* Panneau latéral : édition rapide (statut, progression, étapes) */}
      <Drawer open={!!open} onClose={() => setOpenId(null)}>
        {open && (
          <>
            <div className="relative h-44">
              {open.image ? (
                <img src={open.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy to-blue" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-navy-dark/10 to-transparent" />
              <div className="absolute left-5 bottom-4 right-14">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusStyles[open.status]}`}>{open.status}</span>
                <div className="font-display font-bold text-lg text-white mt-2 leading-tight">{open.name}</div>
                <div className="text-[12.5px] text-white/80">{open.location} · {open.category}</div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-md p-3">
                  <div className="text-[11px] text-muted">Client</div>
                  <div className="text-sm font-semibold text-navy mt-0.5 truncate">{open.client}</div>
                </div>
                <div className="bg-surface rounded-md p-3">
                  <div className="text-[11px] text-muted">Échéance</div>
                  <div className="text-sm font-semibold text-navy mt-0.5">{projectExtras[open.id]?.dueLabel || "—"}</div>
                </div>
              </div>

              <label className={labelClass}>
                Statut
                <select
                  className={`${inputClass} bg-white`}
                  value={open.status}
                  onChange={(e) => onStatusChange(open, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <div>
                <div className="flex justify-between text-xs font-semibold text-muted">
                  <span>Avancement</span>
                  <span className="font-display font-extrabold text-sm text-navy">{open.progress}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={open.progress}
                  onChange={(e) => onProgressChange(open, Number(e.target.value))}
                  className="w-full mt-2.5 accent-green"
                />
              </div>

              <div>
                <div className="text-[11px] font-semibold tracking-wide text-muted">ÉTAPES DU CHANTIER</div>
                <div className="flex flex-col mt-3">
                  {projectSteps.map(([label, threshold], i) => {
                    const done = open.progress >= threshold;
                    const isCurrent = !done && (i === 0 || open.progress >= projectSteps[i - 1][1]);
                    return (
                      <div key={label} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 border-2 ${
                              done
                                ? "bg-green border-green text-[#12310F]"
                                : isCurrent
                                ? "bg-white border-[#E6A23C]"
                                : "bg-white border-black/10"
                            }`}
                          >
                            {done ? "✓" : ""}
                          </span>
                          {i < projectSteps.length - 1 && (
                            <span className={`w-px flex-1 min-h-[14px] ${done ? "bg-green" : "bg-black/10"}`} />
                          )}
                        </div>
                        <div className={`pb-3.5 text-[13px] ${done ? "text-ink font-medium" : isCurrent ? "text-[#A8650F] font-bold" : "text-muted"}`}>
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold tracking-wide text-muted">PHOTOS</div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {open.image && <div className="h-20 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${open.image})` }} />}
                  <button
                    onClick={() => navigate("/admin/media")}
                    className="h-20 rounded-md border-2 border-dashed border-black/15 text-blue text-xs font-semibold flex items-center justify-center hover:border-blue/50 transition-colors"
                  >
                    + Ajouter
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setOpenId(null)}
                  className="flex-1 bg-green text-[#12310F] font-bold text-sm py-3 rounded-md hover:bg-green-dark hover:text-white transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => openEdit(open)}
                  className="flex-1 border border-navy text-navy font-bold text-sm py-3 rounded-md hover:bg-navy hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Pencil size={14} /> Modifier
                </button>
              </div>
            </div>
          </>
        )}
      </Drawer>

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
