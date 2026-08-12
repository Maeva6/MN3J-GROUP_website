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
const poleFilters = ["Tous", ...services.map((s) => s.id)];

export default function Projects() {
  const { t } = useLanguage();
  const [status, setStatus] = useState("Tous");
  const [pole, setPole] = useState("Tous");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (status === "Tous" || p.status === status) &&
          (pole === "Tous" || p.poleId === pole)
      ),
    [status, pole]
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
          <span className="w-px bg-black/10 mx-1" />
          {poleFilters.map((f) => (
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

        {filtered.length === 0 ? (
          <p className="text-muted text-sm">{t("projectsPage.noResults")}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
