import { useState } from "react";
import { LayoutGrid, HardHat, FileText, Users, Settings, UploadCloud, X } from "lucide-react";
import logo from "../assets/images/logo.jpeg";
import { projects, statusStyles } from "../data/projects";

const nav = [
  { icon: LayoutGrid, label: "Dashboard", active: true },
  { icon: HardHat, label: "Chantiers" },
  { icon: FileText, label: "Devis" },
  { icon: Users, label: "Clients" },
  { icon: Settings, label: "Paramètres" },
];

const kpis = [
  { value: projects.length, label: "Chantiers au total" },
  { value: projects.filter((p) => p.status === "En cours").length, label: "En cours" },
  { value: 7, label: "Devis en attente" },
  { value: "98%", label: "Clients satisfaits" },
];

export default function Admin() {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (fileList) => {
    const names = Array.from(fileList).map((f) => f.name);
    setFiles((prev) => [...prev, ...names]);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* SIDEBAR */}
      <aside className="w-64 bg-navy-dark text-white flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-6 h-20 border-b border-white/10">
          <img src={logo} alt="MN3J-GROUP" className="h-8 w-8 object-cover object-top rounded" />
          <span className="font-display font-bold text-sm">MN3J-GROUP</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {nav.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
                active ? "bg-white/10 text-white font-semibold" : "text-white/70 hover:bg-white/5"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1">
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-8">
          <h1 className="text-navy font-display font-semibold text-lg">Tableau de bord</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-8 h-8 rounded-full bg-green text-[#12310F] font-semibold flex items-center justify-center text-xs">
              MN
            </span>
            <span className="text-muted">Admin MN3J</span>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid md:grid-cols-4 gap-5">
            {kpis.map((k) => (
              <div key={k.label} className="bg-white border border-black/5 rounded-lg p-6">
                <div className="text-2xl font-display font-bold text-navy">{k.value}</div>
                <div className="text-xs text-muted mt-1">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5">
              <h2 className="text-navy font-semibold text-sm">Liste des chantiers</h2>
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
                {projects.map((p) => (
                  <tr key={p.id} className="border-t border-black/5">
                    <td className="px-6 py-3 font-medium text-navy">{p.name}</td>
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
                    <td className="px-6 py-3 text-blue font-semibold text-xs cursor-pointer">Modifier</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-black/5 rounded-lg p-6">
            <h2 className="text-navy font-semibold text-sm mb-4">Upload d'images — glisser-déposer</h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById("file-input").click()}
              className={`border-2 border-dashed rounded-lg py-14 text-center cursor-pointer transition-colors ${
                dragOver ? "border-green bg-green/5" : "border-black/15"
              }`}
            >
              <UploadCloud className="mx-auto text-muted mb-3" size={26} />
              <p className="text-sm text-ink">Glissez vos photos ici, ou cliquez pour parcourir</p>
              <p className="text-xs text-muted mt-1">PNG, JPG jusqu'à 10 Mo</p>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {files.map((f, i) => (
                  <span key={i} className="text-xs bg-surface border border-black/10 rounded-full px-3 py-1.5 flex items-center gap-2">
                    {f}
                    <button onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
