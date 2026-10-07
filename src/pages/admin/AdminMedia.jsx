import { useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { projects } from "../../data/projects";
import { useAdminHeaderActions } from "./AdminHeaderContext";
import { useAdminToast } from "./AdminToastContext";

// Médiathèque : import simulé (pas de vrai stockage tant qu'aucun back-end
// n'est branché — voir TODO similaire dans AdminChantiers.jsx). Les fichiers
// déposés ici restent en mémoire du navigateur et sont perdus au rechargement.

const seedFiles = projects.slice(0, 3).map((p, i) => ({
  id: `seed-${i}`,
  name: `${p.id}-photo.jpg`,
  url: p.image,
  size: "2,4 Mo",
  chantier: p.name,
  progress: 100,
}));

export default function AdminMedia() {
  const showToast = useAdminToast();
  const [files, setFiles] = useState(seedFiles);
  const [target, setTarget] = useState(projects[0]?.name ?? "");
  const [filter, setFilter] = useState("Tous");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearInterval), []);

  const addFiles = (list) => {
    const arr = Array.from(list || []).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    const fmt = (b) => (b / 1048576).toFixed(1).replace(".", ",") + " Mo";
    const added = arr.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      url: URL.createObjectURL(f),
      size: fmt(f.size),
      chantier: target,
      progress: 0,
    }));
    setFiles((prev) => [...added, ...prev]);
    let remaining = added.length;
    added.forEach((f) => {
      const iv = setInterval(() => {
        setFiles((prev) =>
          prev.map((x) => {
            if (x.id !== f.id) return x;
            const p = Math.min(100, x.progress + 8 + Math.random() * 14);
            if (p >= 100) {
              clearInterval(iv);
              remaining -= 1;
              if (remaining === 0) {
                showToast(`${added.length} photo${added.length > 1 ? "s" : ""} ajoutée${added.length > 1 ? "s" : ""} à « ${target} ».`);
              }
            }
            return { ...x, progress: p };
          })
        );
      }, 140);
      timers.current.push(iv);
    });
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    showToast("Photo supprimée.");
  };

  // En-tête commun : bouton "Importer des photos" ouvre directement le
  // sélecteur de fichiers.
  useAdminHeaderActions({ newLabel: "Importer des photos", onNew: () => fileRef.current?.click() });

  const names = [...new Set(files.map((f) => f.chantier))];
  const filters = ["Tous", ...names];
  const filtered = filter === "Tous" ? files : files.filter((f) => f.chantier === filter);

  return (
    <>
      <div className="bg-white border border-black/5 rounded-lg p-5 flex flex-wrap gap-5 items-stretch">
        <div className="flex-1 min-w-[220px]">
          <h2 className="font-display font-semibold text-navy text-base">Importer des photos</h2>
          <p className="text-[12.5px] text-muted mt-1">Choisissez le chantier, puis déposez vos images.</p>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full mt-3.5 border border-black/10 rounded-md px-3 py-2.5 text-sm bg-white"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => fileRef.current?.click()}
          className={`flex-[2] min-w-[280px] rounded-lg border-2 border-dashed p-5 flex items-center gap-4 cursor-pointer transition-all ${
            dragOver ? "bg-green/10 border-green scale-[1.01]" : "bg-surface border-black/15"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center shrink-0">
            <UploadCloud size={20} className="text-green" />
          </div>
          <div>
            <div className="text-sm font-semibold text-navy">{dragOver ? "Relâchez pour importer" : "Glissez-déposez vos photos ici"}</div>
            <div className="text-xs text-muted mt-0.5">JPG, PNG jusqu'à 10 Mo</div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const count = f === "Tous" ? files.length : files.filter((x) => x.chantier === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  active ? "bg-navy text-white border-navy" : "text-muted border-black/10 hover:border-navy/40"
                }`}
              >
                {f} <span className="opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        <span className="text-[12.5px] text-muted">{filtered.length} photo{filtered.length > 1 ? "s" : ""}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((f) => (
          <div key={f.id} className="relative bg-white border border-black/5 rounded-lg overflow-hidden">
            <div
              className="h-36 bg-cover bg-center transition-opacity"
              style={{ backgroundImage: `url(${f.url})`, opacity: f.progress < 100 ? 0.5 : 1 }}
            />
            <button
              onClick={() => removeFile(f.id)}
              aria-label="Supprimer"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-navy-dark/75 text-white flex items-center justify-center hover:bg-navy-dark"
            >
              <X size={13} />
            </button>
            <div className="p-2.5">
              <div className="text-[12.5px] font-semibold text-ink truncate">{f.name}</div>
              <div className="text-[11.5px] text-muted mt-0.5 truncate">{f.chantier} · {f.size}</div>
              {f.progress < 100 && (
                <div className="h-1 bg-black/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-green transition-[width] duration-150" style={{ width: `${f.progress}%` }} />
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-black/5 rounded-lg p-10 text-center text-muted text-sm">
            Aucune photo pour ce chantier pour l'instant.
          </div>
        )}
      </div>
    </>
  );
}
