import { useState } from "react";
import { Check } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

// Formulaire local — modifie uniquement une copie en mémoire de siteConfig.
// Pour que ces changements soient réellement appliqués au site, reportez-les
// dans src/data/siteConfig.js (ou branchez ce formulaire sur une API back-end).

const inputClass = "w-full mt-1 border border-black/10 rounded-md px-3 py-2 text-sm";
const labelClass = "text-xs font-semibold text-muted";

export default function AdminParametres() {
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

  const updateHour = (idx, time) => {
    setHours((prev) => prev.map((h, i) => (i === idx ? { ...h, time } : h)));
  };

  const submit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
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
  );
}
