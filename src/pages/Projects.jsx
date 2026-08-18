import { useMemo, useState } from "react";
import PhotoFrame from "../components/PhotoFrame";
import ProjectCard from "../components/ProjectCard";
import Seo from "../components/Seo";
import { projects } from "../data/projects";
import { services } from "../data/services";
import { useLanguage } from "../i18n/LanguageContext";
import projectsHeroImg from "../assets/images/projects-hero-aerien.jpg";

const statusFilters = ["Tous", "Réalisé", "En cours", "Planifié"];
// Ordre volontaire : reflète l'ordre des pôles dans la navbar (Piscines · Décoration · BTP · Formation).
// Les pôles portés par une marque dédiée (ex. Formation → ASCII) ne sont pas mélangés
// aux autres : ils ont leur propre section, plus bas sur la page.
const corePoles = services.filter((s) => !s.brand);
const brandedPoles = services.filter((s) => s.brand);
const brands = [...new Set(brandedPoles.map((s) => s.brand))];
const corePoleFilters = ["Tous", ...corePoles.map((s) => s.id)];

export default function Projects() {
  const { t } = useLanguage();
  const [status, setStatus] = useState("Tous");
  const [pole, setPole] = useState("Tous");

  const coreProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          (status === "Tous" || p.status === status) &&
          corePoles.some((s) => s.id === p.poleId) &&
          (pole === "Tous" || p.poleId === pole)
      ),
    [status, pole]
  );

  const brandProjects = (brand) =>
    projects.filter(
      (p) =>
        (status === "Tous" || p.status === status) &&
        brandedPoles.some((s) => s.id === p.poleId && s.brand === brand)
    );

  const filterLabel = (f) => (f === "Tous" ? t("projectsPage.all") : t(`data.status.${f}`));
  const poleLabel = (f) => (f === "Tous" ? t("projectsPage.all") : t(`data.services.${f}.tagline`));

  return (
    <div>
      <Seo title={t("seo.projects.title")} description={t("seo.projects.description")} />

      <PhotoFrame tone="navy" src={projectsHeroImg} alt={t("projectsPage.heroLabel")} label={t("projectsPage.heroLabel")} className="h-64">
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container-page pb-10">
            <span className="eyebrow text-[#A9E072]">{t("projectsPage.eyebrow")}</span>
            <h1 className="text-white text-3xl md:text-4xl font-bold mt-2">{t("projectsPage.title")}</h1>
            <p className="text-white/80 mt-2 max-w-lg text-sm">{t("projectsPage.intro")}</p>
          </div>
        </div>
      </PhotoFrame>

      <div className="container-page py-10">
        <div className="flex flex-wrap gap-3 mb-10">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
                status === f
                  ? "bg-navy text-white border-navy"
                  : "border-black/10 text-muted hover:border-navy/40"
              }`}
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>

        {/* SECTION 1 — Chantiers MN3J-GROUP (piscines, décoration, BTP) */}
        <section>
          <h2 className="text-navy font-display font-semibold text-lg mb-4">
            {t("projectsPage.coreSectionTitle")}
          </h2>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {corePoleFilters.map((f) => (
              <button
                key={f}
                onClick={() => setPole(f)}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
                  pole === f
                    ? "bg-green text-[#12310F] border-green"
                    : "border-black/10 text-muted hover:border-green/50"
                }`}
              >
                {poleLabel(f)}
              </button>
            ))}
          </div>

          {coreProjects.length === 0 ? (
            <p className="text-muted text-sm">{t("projectsPage.noResults")}</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {coreProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2 — Une section à part par marque dédiée (ex. Formation → ASCII),
            pour ne jamais la mélanger visuellement aux chantiers MN3J-GROUP. */}
        {brands.map((brand) => {
          const brandPole = brandedPoles.find((s) => s.brand === brand);
          const list = brandProjects(brand);
          return (
            <section
              key={brand}
              className="mt-14 border-2 border-green/25 rounded-2xl bg-green/5 p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-green-dark bg-green rounded-full px-3 py-1">
                  {brand}
                </span>
                <h2 className="text-navy font-display font-semibold text-lg">
                  {t("projectsPage.formationGroupLabel")}
                </h2>
              </div>
              <p className="text-muted text-sm max-w-xl mb-6">
                {t(`data.services.${brandPole.id}.brandNote`)}
              </p>

              {list.length === 0 ? (
                <p className="text-muted text-sm">{t("projectsPage.noResults")}</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {list.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
