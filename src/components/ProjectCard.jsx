import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import PhotoFrame from "./PhotoFrame";
import { statusStyles } from "../data/projects";
import { services } from "../data/services";
import { useLanguage } from "../i18n/LanguageContext";

export default function ProjectCard({ project }) {
  const { t } = useLanguage();
  const brand = services.find((s) => s.id === project.poleId)?.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        to={`/chantiers/${project.id}`}
        className="group block rounded-lg overflow-hidden border border-black/5 bg-white hover:shadow-card transition-shadow"
      >
        <PhotoFrame
          tone="navy"
          src={project.image}
          alt={project.name}
          label={project.name}
          className="h-52 group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full ${statusStyles[project.status]}`}
            >
              {t(`data.status.${project.status}`)}
            </span>
            {brand && (
              <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-green-dark bg-green/15 rounded-full px-2.5 py-1">
                {brand}
              </span>
            )}
          </div>
          <h4 className="font-display font-semibold text-navy text-base">{project.name}</h4>
          <p className="text-xs text-muted mt-1 flex items-center gap-1">
            <MapPin size={12} /> {t(`data.category.${project.category}`)} · {project.location}
          </p>

          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-muted mb-1">
              <span>{t("common.progress")}</span>
              <span className="font-semibold text-navy">{project.progress}%</span>
            </div>
            <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-green rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
