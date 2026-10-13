import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import PhotoFrame from "../components/PhotoFrame";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { siteConfig } from "../data/siteConfig";
import { useLanguage } from "../i18n/LanguageContext";
import contactHeroImg from "../assets/images/hero-piscine-miroir.jpg";

// Chiffres repris tels quels d'ailleurs sur le site, pas inventés pour cette
// page : 48h est la promesse de délai déjà répétée partout (CTA, FAQ, page
// Merci), 150+ vient de src/data/projects.js (stats de l'accueil), et 5 est
// le nombre réel de pôles (src/data/services.js).
const heroStats = [
  { value: 48, suffix: "h", labelKey: "contact.statResponseLabel" },
  { value: 150, suffix: "+", labelKey: "data.stats.Chantiers réalisés" },
  { value: 5, suffix: "", labelKey: "contact.statPolesLabel" },
];

function CountUp({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    let start;
    const step = (timestamp) => {
      if (start === undefined) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return display;
}

// Doit rester cohérent avec siteConfig.hours (Lundi–Vendredi 8h–18h, Samedi
// 9h–14h, Dimanche fermé) : un vrai parseur générique pour un horaire en
// texte libre serait fragile pour un gain marginal sur ces 3 lignes fixes.
function isOpenNow() {
  const d = new Date();
  const day = d.getDay();
  const hour = d.getHours() + d.getMinutes() / 60;
  const weekdayOpen = day >= 1 && day <= 5 && hour >= 8 && hour < 18;
  const saturdayOpen = day === 6 && hour >= 9 && hour < 14;
  return weekdayOpen || saturdayOpen;
}

function todayHoursIndex() {
  const day = new Date().getDay();
  if (day >= 1 && day <= 5) return 0;
  if (day === 6) return 1;
  return 2;
}

export default function Contact() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const projectTypes = t("contact.projectTypes");
  const budgetOptions = t("contact.budgetOptions");
  const [typeIndex, setTypeIndex] = useState(0);
  const [msgCount, setMsgCount] = useState(0);

  const open = isOpenNow();
  const todayIdx = todayHoursIndex();
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${siteConfig.map.lat}%2C${siteConfig.map.lng}`;

  // Pas de back-end branché pour l'instant (voir server/README.md) : la
  // demande est envoyée directement par le visiteur via WhatsApp et son
  // client email, plutôt que perdue silencieusement.
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Anti-spam : champ honeypot invisible pour un visiteur humain (masqué en
    // CSS, jamais au clavier grâce à tabIndex=-1) mais que les bots
    // remplissent aveuglément. Rempli => on abandonne silencieusement, sans
    // signaler au bot que sa soumission a été détectée.
    if (data.get("website")) return;

    const fullName = data.get("fullName");
    const phone = data.get("phone");
    const email = data.get("email");
    const projectType = data.get("projectType");
    const budget = data.get("budget");
    const message = data.get("message");

    const summary = [
      "Nouvelle demande de devis : MN3J-GROUP",
      "",
      `Nom : ${fullName}`,
      `Téléphone : ${phone}`,
      `Email : ${email}`,
      `Type de projet : ${projectType}`,
      `Budget estimé : ${budget}`,
      `Message : ${message}`,
    ].join("\n");

    window.open(`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(summary)}`, "_blank", "noopener,noreferrer");
    window.open(
      `mailto:${siteConfig.email}?subject=${encodeURIComponent(`Nouvelle demande de devis : ${fullName}`)}&body=${encodeURIComponent(summary)}`,
      "_blank",
      "noopener,noreferrer"
    );

    navigate("/merci");
  };

  return (
    <div>
      <Seo title={t("seo.contact.title")} description={t("seo.contact.description")} />

      {/* HERO */}
      <section className="relative">
        <PhotoFrame
          tone="navy"
          src={contactHeroImg}
          alt={t("contact.heroImageLabel")}
          objectPosition="bottom"
          className="h-[560px] md:h-[620px]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192D] via-[#0A192D]/75 to-[#0A192D]/30" />
          <div className="relative h-full container-page flex flex-col justify-center pb-20 md:pb-24">
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-green/15 border border-green/35 text-[#A9E072] text-xs font-bold uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
                  </span>
                  {t("contact.eyebrow")}
                </span>
                <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mt-5">
                  {t("contact.heroTitleLine1")} <span className="text-green">{t("contact.heroTitleAccent")}</span> {t("contact.heroTitleLine2")}
                </h1>
                <p className="text-[#DBE4EF] mt-5 max-w-md leading-relaxed">{t("contact.heroText")}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="grid grid-cols-3 gap-3"
              >
                {heroStats.map((s) => (
                  <div key={s.labelKey} className="rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm p-4 text-center">
                    <div className="font-display font-extrabold text-2xl md:text-3xl text-white tabular-nums">
                      <CountUp value={s.value} />
                      {s.suffix}
                    </div>
                    <div className="text-[11px] text-white/70 mt-1.5 leading-snug">{t(s.labelKey)}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </PhotoFrame>
      </section>

      {/* CONTACTS RAPIDES — flottent sur le bas du hero */}
      <div className="container-page">
        <div className="relative -mt-14 md:-mt-16 z-10 grid sm:grid-cols-3 gap-4">
          <Reveal as="a" href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="bg-white rounded-xl shadow-card p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all">
            <span className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center shrink-0">
              <Phone size={20} className="text-white" />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-muted uppercase tracking-wider">{t("contact.quickContact.callLabel")}</div>
              <div className="font-display font-bold text-navy text-[15px] mt-1 truncate">{siteConfig.phone}</div>
              {siteConfig.phone2 && <div className="text-xs text-muted truncate">{siteConfig.phone2}</div>}
            </div>
          </Reveal>

          <Reveal
            as="a"
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            delay={0.08}
            className="bg-white rounded-xl shadow-card p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <span className="w-12 h-12 rounded-lg bg-green flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-[#12310F]" />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-muted uppercase tracking-wider">{t("contact.quickContact.whatsappLabel")}</div>
              <div className="font-display font-bold text-navy text-[15px] mt-1 truncate">{t("contact.quickContact.whatsappText")}</div>
              <div className="text-xs text-muted truncate">{t("contact.quickContact.whatsappSub")}</div>
            </div>
          </Reveal>

          <Reveal as="a" href={`mailto:${siteConfig.email}`} delay={0.16} className="bg-white rounded-xl shadow-card p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all">
            <span className="w-12 h-12 rounded-lg bg-blue flex items-center justify-center shrink-0">
              <Mail size={20} className="text-white" />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-muted uppercase tracking-wider">{t("contact.quickContact.emailLabel")}</div>
              <div className="font-display font-bold text-navy text-[15px] mt-1 truncate">{siteConfig.email}</div>
              <div className="text-xs text-muted truncate">{t("contact.quickContact.emailSub")}</div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* DEVIS + HORAIRES/CARTE */}
      <div id="devis" className="container-page pt-16 pb-20 grid lg:grid-cols-3 gap-10 items-start">
        <Reveal as="div" className="lg:col-span-2 bg-white border border-black/5 rounded-xl shadow-card p-6 md:p-10 relative overflow-hidden">
          <span className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-navy via-blue to-green" aria-hidden="true" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-navy font-display font-semibold text-2xl">{t("contact.formTitle")}</h2>
              <p className="text-muted text-sm mt-1.5">{t("contact.formSubtitle")}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-dark bg-green/10 px-3 py-2 rounded-full shrink-0">
              <ShieldCheck size={14} /> {t("contact.confidentialBadge")}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />

            <div>
              <div className="text-xs font-semibold text-muted mb-2.5">{t("contact.projectTypeQuestion")}</div>
              <div className="flex flex-wrap gap-2.5">
                {projectTypes.map((label, i) => {
                  const active = typeIndex === i;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setTypeIndex(i)}
                      className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors ${
                        active ? "bg-navy text-white border-navy" : "border-black/10 text-muted hover:border-navy/40"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" name="projectType" value={projectTypes[typeIndex] ?? ""} />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-muted">{t("contact.fields.fullName")}</label>
                <input name="fullName" required type="text" className="w-full mt-1.5 border border-black/10 rounded-md px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted">{t("contact.fields.phone")}</label>
                <input name="phone" required type="tel" className="w-full mt-1.5 border border-black/10 rounded-md px-4 py-2.5 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted">{t("contact.fields.email")}</label>
                <input name="email" required type="email" className="w-full mt-1.5 border border-black/10 rounded-md px-4 py-2.5 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted">{t("contact.fields.budget")}</label>
                {/* ⚠️ À AJUSTER : tranches de budget et devise (FCFA) à confirmer selon votre marché réel. */}
                <select name="budget" className="w-full mt-1.5 border border-black/10 rounded-md px-4 py-2.5 text-sm bg-white">
                  {budgetOptions.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-muted">
                <label>{t("contact.fields.message")}</label>
                <span className="font-medium text-muted">{msgCount}/600</span>
              </div>
              <textarea
                name="message"
                rows={5}
                maxLength={600}
                onChange={(e) => setMsgCount(e.target.value.length)}
                className="w-full mt-1.5 border border-black/10 rounded-md px-4 py-2.5 text-sm"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-green text-[#12310F] font-bold text-[15px] py-4 rounded-lg hover:bg-green-dark hover:text-white transition-colors"
            >
              {t("contact.fields.send")} <ArrowRight size={18} />
            </button>
          </form>
        </Reveal>

        <Reveal as="div" delay={0.12} className="flex flex-col gap-5">
          <div className="bg-navy rounded-xl p-7 text-white relative overflow-hidden">
            <span className="absolute w-44 h-44 rounded-full bg-green/25 blur-2xl -right-14 -top-14" aria-hidden="true" />
            <div className="relative flex items-center justify-between gap-3 flex-wrap">
              <h3 className="font-display font-semibold text-lg">{t("contact.hoursLabel")}</h3>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-full ${
                  open ? "bg-green/20 text-[#b6e585]" : "bg-white/10 text-white/70"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" /> {open ? t("contact.openNow") : t("contact.closedNow")}
              </span>
            </div>
            <div className="relative mt-5 flex flex-col">
              {siteConfig.hours.map((h, i) => (
                <div
                  key={h.day}
                  className={`flex justify-between gap-3 text-sm px-3.5 py-3 rounded-md ${i === todayIdx ? "bg-green/15" : ""}`}
                >
                  <span className="text-[#dbe4ef]">{t(`data.hoursDay.${h.day}`)}</span>
                  <span className="font-semibold text-white">{h.time === "Fermé" ? t("data.hoursTime.Fermé") : h.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-xl shadow-card overflow-hidden">
            <div className="relative h-56 bg-surface">
              {siteConfig.map.lat != null && siteConfig.map.lng != null ? (
                <iframe
                  title={t("contact.mapLabel")}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${siteConfig.map.lng - 0.015}%2C${siteConfig.map.lat - 0.015}%2C${siteConfig.map.lng + 0.015}%2C${siteConfig.map.lat + 0.015}&layer=mapnik&marker=${siteConfig.map.lat}%2C${siteConfig.map.lng}`}
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              ) : (
                <PhotoFrame tone="navy" label={t("contact.mapLabel")} className="w-full h-full" />
              )}
            </div>
            <div className="p-5 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center shrink-0">
                  <MapPin size={17} className="text-green-dark" />
                </span>
                <div className="min-w-0">
                  <div className="font-display font-bold text-navy text-sm truncate">
                    {siteConfig.address.street}, {siteConfig.address.city}
                  </div>
                  <div className="text-xs text-muted">{siteConfig.address.country}</div>
                </div>
              </div>
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-semibold text-navy border border-navy rounded-md px-3.5 py-2 hover:bg-navy hover:text-white transition-colors"
              >
                {t("contact.directionsCta")} →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
