import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import PhotoFrame from "../components/PhotoFrame";
import { siteConfig } from "../data/siteConfig";
import { useLanguage } from "../i18n/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const projectTypes = t("contact.projectTypes");
  const budgetOptions = t("contact.budgetOptions");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO : brancher sur l'API back-end (envoi e-mail + enregistrement en base).
    setSent(true);
  };

  return (
    <div>
      <div className="container-page py-14">
        <span className="eyebrow">{t("contact.eyebrow")}</span>
        <h1 className="text-3xl text-navy font-display font-semibold mt-2">{t("contact.title")}</h1>
      </div>

      <div className="container-page pb-20 grid md:grid-cols-3 gap-10">
        <div className="space-y-8">
          <div>
            <h3 className="text-navy font-semibold text-sm flex items-center gap-2 mb-1">
              <MapPin size={15} /> {t("contact.addressLabel")}
            </h3>
            <p className="text-muted text-sm">
              {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.country}
            </p>
          </div>
          <div>
            <h3 className="text-navy font-semibold text-sm flex items-center gap-2 mb-1">
              <Phone size={15} /> {t("contact.phoneLabel")}
            </h3>
            <p className="text-muted text-sm">{siteConfig.phone}</p>
          </div>
          <div>
            <h3 className="text-navy font-semibold text-sm flex items-center gap-2 mb-1">
              <Mail size={15} /> {t("contact.emailLabel")}
            </h3>
            <p className="text-muted text-sm">{siteConfig.email}</p>
          </div>
          <div>
            <h3 className="text-navy font-semibold text-sm flex items-center gap-2 mb-1">
              <Clock size={15} /> {t("contact.hoursLabel")}
            </h3>
            <ul className="text-muted text-sm space-y-1">
              {siteConfig.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{t(`data.hoursDay.${h.day}`)}</span>
                  <span>{h.time === "Fermé" ? t("data.hoursTime.Fermé") : h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <PhotoFrame tone="navy" label={t("contact.mapLabel")} className="h-48 rounded-lg" />
        </div>

        <div className="md:col-span-2 bg-surface rounded-lg p-8">
          <h2 className="text-navy font-display font-semibold text-xl mb-1">{t("contact.formTitle")}</h2>
          <p className="text-muted text-sm mb-6">{t("contact.formSubtitle")}</p>

          {sent ? (
            <div className="bg-green/10 border border-green/30 rounded-md p-6 text-green-dark text-sm">
              {t("contact.successMessage")}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-muted">{t("contact.fields.fullName")}</label>
                <input required type="text" className="w-full mt-1 border border-black/10 rounded-md px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted">{t("contact.fields.phone")}</label>
                <input required type="tel" className="w-full mt-1 border border-black/10 rounded-md px-4 py-2.5 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-muted">{t("contact.fields.email")}</label>
                <input required type="email" className="w-full mt-1 border border-black/10 rounded-md px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted">{t("contact.fields.projectType")}</label>
                <select required className="w-full mt-1 border border-black/10 rounded-md px-4 py-2.5 text-sm bg-white">
                  <option value="">{t("contact.fields.selectPlaceholder")}</option>
                  {projectTypes.map((tOpt) => <option key={tOpt}>{tOpt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted">{t("contact.fields.budget")}</label>
                {/* ⚠️ À AJUSTER : tranches de budget et devise (FCFA) à confirmer selon votre marché réel. */}
                <select className="w-full mt-1 border border-black/10 rounded-md px-4 py-2.5 text-sm bg-white">
                  {budgetOptions.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-muted">{t("contact.fields.message")}</label>
                <textarea rows={5} className="w-full mt-1 border border-black/10 rounded-md px-4 py-2.5 text-sm" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="btn-primary">{t("contact.fields.send")}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
