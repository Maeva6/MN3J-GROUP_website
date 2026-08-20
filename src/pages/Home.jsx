import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, LayoutGrid } from "lucide-react";
import PhotoFrame from "../components/PhotoFrame";
import HeroSlideshow from "../components/HeroSlideshow";
import StatsBar from "../components/StatsBar";
import ProjectCard from "../components/ProjectCard";
import SocialIcons from "../components/SocialIcons";
import Testimonials from "../components/Testimonials";
import Faq from "../components/Faq";
import Seo from "../components/Seo";
import { services } from "../data/services";
import { projects } from "../data/projects";
import { siteConfig } from "../data/siteConfig";
import { useLanguage } from "../i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const weekdayHours = siteConfig.hours[0];
  const polesSummary = services.map(({ id }) => t(`data.services.${id}.title`)).join(" · ");

  // Piscine haut de gamme en premier (image d'accueil signature — "services"
  // liste déjà Piscines en tête), puis un aperçu de chaque autre pôle —
  // décoration, BTP, formation — en fondu-enchaîné.
  const heroSlides = services.map(({ id, image }) => ({
    src: image,
    alt: id === "piscines" ? t("home.heroLabel") : t(`data.services.${id}.title`),
  }));

  return (
    <div>
      <Seo title={t("seo.home.title")} description={t("seo.home.description")} />

      {/* HERO */}
      <section className="relative">
        <HeroSlideshow slides={heroSlides} className="h-[720px]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192D]/85 via-[#0A192D]/35 to-transparent" />
          <div className="relative h-full container-page flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <span className="eyebrow text-[#A9E072]">{t("home.heroEyebrow")}</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">
                {t("home.heroAccent")}
              </span>
              <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mt-4">
                {t("home.heroTitleLine1")}
                <br />
                {t("home.heroTitleLine2")}
              </h1>
              <p className="text-[#DBE4EF] mt-5 max-w-md leading-relaxed">{t("home.heroText")}</p>

              {/* Points d'ancrage : horaires, localisation, expertises */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-xs text-white/75">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {t(`data.hoursDay.${weekdayHours.day}`)} · {weekdayHours.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> {siteConfig.address.city}, {siteConfig.address.street}
                </span>
                <span className="flex items-center gap-1.5">
                  <LayoutGrid size={13} /> {polesSummary}
                </span>
              </div>

            </motion.div>
          </div>
        </HeroSlideshow>

        <div className="container-page">
          <div className="relative mt-6 md:-mt-12 z-10">
            <StatsBar />
          </div>
        </div>
      </section>

      {/* POLES D'ACTIVITE */}
      <section className="section container-page py-24">
        <div className="max-w-xl mx-auto text-center mb-14">
          <span className="eyebrow">{t("home.polesEyebrow")}</span>
          <h2 className="text-3xl text-navy mt-3">{t("home.polesTitle")}</h2>
          <p className="text-muted mt-3 text-sm leading-relaxed">{t("home.polesText")}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {services.map(({ id, icon: Icon, featuredSub, subImages, brand }, i) => {
            const featured = t(`data.services.${id}.subItems`).find((s) => s.id === featuredSub);
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-md overflow-hidden border border-black/5 hover:shadow-card hover:-translate-y-1 transition-all bg-white flex flex-col"
              >
                <div className="p-7 pb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      i % 2 === 0 ? "bg-navy" : "bg-green"
                    }`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-blue font-semibold">
                      {t(`data.services.${id}.accent`)}
                    </span>
                    {brand && (
                      <span className="text-[9px] uppercase tracking-wider font-bold text-green-dark bg-green/15 rounded-full px-1.5 py-0.5">
                        {brand}
                      </span>
                    )}
                  </div>
                  <h3 className="text-navy font-display font-semibold text-[17px] mt-1">
                    {t(`data.services.${id}.title`)}
                  </h3>
                </div>

                <PhotoFrame
                  src={subImages[featuredSub]}
                  alt={featured.title}
                  tone="navy"
                  className="h-36"
                />

                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[13.5px] text-ink font-medium">{featured.title}</span>
                  <p className="text-muted text-xs leading-relaxed mt-1 flex-1">{featured.description}</p>
                  <Link to={`/services/${id}`} className="text-blue text-sm font-semibold mt-3 inline-block">
                    {t("common.learnMore")}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* DERNIERS CHANTIERS */}
      <section className="bg-surface py-24">
        <div className="container-page">
          <div className="max-w-xl mx-auto text-center mb-14">
            <span className="eyebrow">{t("home.realisationsEyebrow")}</span>
            <h2 className="text-3xl text-navy mt-3">{t("home.realisationsTitle")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/chantiers" className="text-blue font-semibold text-sm inline-flex items-center gap-1">
              {t("home.viewAllProjects")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* RESEAUX SOCIAUX */}
      {/* Carte flottante (pas une barre pleine largeur) pour éviter tout effet
          "footer" avant d'arriver au vrai Footer, plus bas sur la page. */}
      <section className="container-page py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-r from-navy to-blue px-6 md:px-10 py-10 shadow-card flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <span className="text-[#A9E072] text-[11px] font-semibold uppercase tracking-wider">
              {t("home.followEyebrow")}
            </span>
            <p className="text-white font-display font-semibold text-lg mt-1">
              {t("home.followProjects")}
            </p>
          </div>
          <SocialIcons variant="dark" size="lg" animated />
        </motion.div>
      </section>

      <Testimonials />

      <Faq />

      {/* CTA */}
      <div className="bg-green py-14">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[#12310F] text-2xl font-display font-bold">{t("common.ctaTitle")}</h3>
            <p className="text-[#20431A] text-sm mt-1">{t("common.ctaText")}</p>
          </div>
          <Link to="/contact" className="btn-dark">
            {t("common.requestQuote")}
          </Link>
        </div>
      </div>
    </div>
  );
}
