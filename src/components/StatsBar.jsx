import { motion } from "framer-motion";
import { stats } from "../data/projects";
import { useLanguage } from "../i18n/LanguageContext";

export default function StatsBar({ floating = true }) {
  const { t } = useLanguage();

  return (
    <div
      className={
        floating
          ? "bg-white rounded-lg shadow-card grid grid-cols-2 md:grid-cols-4 divide-x divide-black/5"
          : "bg-white grid grid-cols-2 md:grid-cols-4 divide-x divide-black/5"
      }
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="text-center py-7 px-2"
        >
          <div className="font-display font-extrabold text-3xl text-navy">{s.value}</div>
          <div className="text-xs text-muted mt-1">{t(`data.stats.${s.label}`)}</div>
        </motion.div>
      ))}
    </div>
  );
}
