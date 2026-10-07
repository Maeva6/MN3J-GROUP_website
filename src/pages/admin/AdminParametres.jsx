import { useState } from "react";
import { Check } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";
import { teamMembers } from "../../data/adminData";

// Formulaire local — modifie uniquement une copie en mémoire de siteConfig.
// Pour que ces changements soient réellement appliqués au site, reportez-les
// dans src/data/siteConfig.js (ou branchez ce formulaire sur une API back-end).

const inputClass = "w-full mt-1 border border-black/10 rounded-md px-3 py-2 text-sm";
const labelClass = "text-xs font-semibold text-muted";

const tabs = ["Entreprise", "Utilisateurs", "Notifications"];

// Accès par membre de l'équipe — démonstration (pas de gestion de droits
// réelle tant qu'il n'y a pas de back-end branché).
const accessLevels = { MN: "Administrateur", AK: "Éditeur", JD: "Éditeur", FT: "Lecture seule" };
const accessStyles = {
  Administrateur: "bg-navy text-white",
  "Éditeur": "bg-[#E6EEF8] text-blue",
  "Lecture seule": "bg-black/5 text-muted",
};

const notifDefs = [
  { key: "devis", label: "Nouvelle demande de devis", desc: "Email immédiat à l'administrateur" },
  { key: "chantier", label: "Changement de statut d'un chantier", desc: "Notification aux membres de l'équipe concernée" },
  { key: "hebdo", label: "Rapport hebdomadaire", desc: "Synthèse envoyée chaque lundi à 8h" },
  { key: "sms", label: "Alertes SMS urgentes", desc: "Retards de livraison et incidents de chantier" },
];

export default function AdminParametres() {
  const [tab, setTab] = useState("Entreprise");
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    companyName: siteConfig.companyName,
    street: siteConfig.address.street,
    city: siteConfig.address.city,
    country: siteConfig.address.country,
    phone: siteConfig.phone,
    email: siteConfig.email,
    lat: siteConfig.map.lat ?? "",
    lng: siteConfig.map.lng ?? "",
  });
  const [hours, setHours] = useState(siteConfig.hours);
  const [social, setSocial] = useState(siteConfig.social);
  const [saved, setSaved] = useState(false);

  const [notif, setNotif] = useState({ devis: true, chantier: true, hebdo: false, sms: true });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const updateHour = (idx, time) => {
    setHours((prev) => prev.map((h, i) => (i === idx ? { ...h, time } : h)));
  };

  const submit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleNotif = (key) => {
    setNotif((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex gap-1 border-b border-black/10">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-semibold border-b-[2.5px] -mb-px transition-colors ${
              tab === t ? "text-navy border-green" : "text-muted border-transparent hover:text-navy"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Entreprise" && (
        <form onSubmit={submit} className="space-y-6">
          {saved && (
            <div className="bg-green/10 border border-green/30 rounded-md p-4 text-green-dark text-sm flex items-center gap-2">
              <Check size={16} /> Modifications enregistrées localement. Reportez-les dans src/data/siteConfig.js pour les rendre définitives.
            </div>
          )}

          <div className="bg-white border border-black/5 rounded-lg p-6 space-y-4">
            <h2 className="text-navy font-semibold text-sm">Informations générales</h2>
            <div>
              <label className={labelClass}>Nom de l'entreprise</label>
              <input className={inputClass} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Téléphone</label>
                <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>E-mail</label>
                <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-lg p-6 space-y-4">
            <h2 className="text-navy font-semibold text-sm">Adresse & localisation</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Rue / quartier</label>
                <input className={inputClass} value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Ville</label>
                <input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Pays</label>
                <input className={inputClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Latitude</label>
                <input className={inputClass} value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Longitude</label>
                <input className={inputClass} value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-lg p-6 space-y-4">
            <h2 className="text-navy font-semibold text-sm">Horaires d'ouverture</h2>
            <div className="space-y-3">
              {hours.map((h, idx) => (
                <div key={h.day} className="flex items-center gap-4">
                  <span className="text-sm text-ink w-40 shrink-0">{h.day}</span>
                  <input className={`${inputClass} mt-0`} value={h.time} onChange={(e) => updateHour(idx, e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-lg p-6 space-y-4">
            <h2 className="text-navy font-semibold text-sm">Réseaux sociaux</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.keys(social).map((key) => (
                <div key={key}>
                  <label className={`${labelClass} capitalize`}>{key}</label>
                  <input
                    className={inputClass}
                    value={social[key]}
                    onChange={(e) => setSocial({ ...social, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-navy text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-navy-dark transition-colors">
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {tab === "Utilisateurs" && (
        <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h2 className="text-navy font-semibold text-sm">Membres de l'équipe</h2>
              <div className="text-xs text-muted mt-0.5">Gérez les accès au back-office.</div>
            </div>
            <button
              onClick={() => showToast("Invitation envoyée")}
              className="border border-navy text-navy font-semibold text-[13px] px-4 py-2 rounded-md hover:bg-navy hover:text-white transition-colors whitespace-nowrap"
            >
              + Inviter un membre
            </button>
          </div>
          {Object.entries(teamMembers).map(([initials, member]) => (
            <div key={initials} className="flex flex-wrap items-center gap-3.5 px-6 py-3.5 border-t border-black/5">
              <span className={`w-9 h-9 rounded-full ${member.bg} text-white font-display font-bold text-xs flex items-center justify-center shrink-0`}>
                {initials}
              </span>
              <div className="flex-1 min-w-[160px]">
                <div className="text-[13.5px] font-semibold text-navy">{member.name}</div>
                <div className="text-xs text-muted">{member.role}</div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${accessStyles[accessLevels[initials]]}`}>
                {accessLevels[initials]}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-green-dark min-w-[60px]">
                <span className="w-1.5 h-1.5 rounded-full bg-green" /> Actif
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "Notifications" && (
        <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
          <div className="px-6 py-5">
            <h2 className="text-navy font-semibold text-sm">Notifications</h2>
            <div className="text-xs text-muted mt-0.5">Choisissez quand l'équipe est alertée.</div>
          </div>
          {notifDefs.map((n) => (
            <button
              key={n.key}
              onClick={() => toggleNotif(n.key)}
              className="w-full flex items-center gap-4 px-6 py-4 border-t border-black/5 text-left"
            >
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold text-ink">{n.label}</div>
                <div className="text-xs text-muted mt-0.5">{n.desc}</div>
              </div>
              <span
                className={`w-11 h-6 rounded-full relative shrink-0 transition-colors ${notif[n.key] ? "bg-green" : "bg-black/15"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    notif[n.key] ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed right-7 bottom-7 z-40 flex items-center gap-3 bg-navy-dark text-white px-5 py-3.5 rounded-lg shadow-card text-[13.5px]">
          <span className="w-6 h-6 rounded-full bg-green flex items-center justify-center shrink-0">
            <Check size={13} className="text-[#12310F]" />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}
