import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Clock, User, Check } from "lucide-react";
import PhotoFrame from "../components/PhotoFrame";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import Seo from "../components/Seo";
import { projects, statusStyles, beforeImages } from "../data/projects";
import { useLanguage } from "../i18n/LanguageContext";

export default function ProjectDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-muted">{t("projectDetail.notFound")}</p>
        <Link to="/chantiers" className="text-blue font-semibold text-sm">
          {t("projectDetail.backToProjects")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Seo
        title={`${project.name} — MN3J-GROUP`}
        description={t(`data.projects.${project.id}.description`)}
      />

      <PhotoFrame tone="navy" src={project.image} alt={project.name} label={project.name} className="h-80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-page pb-8">
          <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full mb-3 ${statusStyles[project.status]}`}>
            {t(`data.status.${project.status}`)}
          </span>
          <h1 className="text-white text-3xl md:text-4xl font-bold">{project.name}</h1>
          <p className="text-white/80 text-sm mt-2 flex items-center gap-1">
            <MapPin size={14} /> {t(`data.category.${project.category}`)} · {project.location}
          </p>
        </div>
      </PhotoFrame>

      <div className="container-page py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-10">
          <div>
            <h2 className="text-navy font-display font-semibold text-xl mb-3">{t("projectDetail.descriptionTitle")}</h2>
            <p className="text-muted text-sm leading-relaxed">{t(`data.projects.${project.id}.description`)}</p>
          </div>

          {project.poleId === "formation" ? (
            // Un chantier ASCII est une formation, pas une transformation physique
            // d'un lieu : l'avant/après (pensé pour piscines/BTP/décoration) n'a
            // pas de sens ici. Remplacé par les points clés du programme.
            // Le slider avant/après reste disponible ci-dessous (branche piscines/
            // BTP/décoration) si un usage pertinent apparaît un jour pour la
            // formation (ex. niveau avant/après stage).
            <div>
              <h2 className="text-navy font-display font-semibold text-xl mb-4">
                {t("projectDetail.formationHighlightsTitle")}
              </h2>
              <ul className="space-y-3">
                {t("projectDetail.formationHighlights").map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-ink">
                    <span className="w-5 h-5 rounded-full bg-green/15 text-green-dark flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-navy font-display font-semibold text-xl">{t("projectDetail.transformationTitle")}</h2>
                <span className="text-xs text-muted flex items-center gap-1">
                  {t("projectDetail.dragToCompare")}
                </span>
              </div>
              <BeforeAfterSlider beforeSrc={beforeImages[project.poleId]} afterSrc={project.image} />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="border border-black/5 rounded-lg p-6 bg-surface">
            <h3 className="text-navy font-semibold text-sm mb-4">{t("projectDetail.infoTitle")}</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2"><User size={14} /> {project.client}</li>
              <li className="flex items-center gap-2"><Calendar size={14} /> {t("projectDetail.deliveredIn", { year: project.year })}</li>
              <li className="flex items-center gap-2"><Clock size={14} /> {t("projectDetail.durationLabel")} : {t(`data.projects.${project.id}.duration`)}</li>
            </ul>

            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>{t("common.progress")}</span>
                <span className="font-semibold text-navy">{project.progress}%</span>
              </div>
              <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-green rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          </div>

          <Link to="/contact" className="btn-primary w-full justify-center">
            {t("projectDetail.similarProject")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
