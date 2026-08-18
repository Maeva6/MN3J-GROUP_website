import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { stats } from "../data/projects";
import { useLanguage } from "../i18n/LanguageContext";

// Sépare la partie numérique animable (ex: "150", "100") du suffixe
// affiché tel quel (ex: "+", "%") pour chaque statistique.
function parseStatValue(value) {
  const match = value.match(/^(\d+)(.*)$/);
  return match ? { target: Number(match[1]), suffix: match[2] } : { target: 0, suffix: value };
}

function AnimatedStatValue({ value, shouldAnimate }) {
  const { target, suffix } = parseStatValue(value);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [shouldAnimate, target]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

export default function StatsBar({ floating = true }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  // "once: true" : l'animation ne se rejoue pas à chaque scroll, pour rester
  // percutante sans devenir répétitive.
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
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
          <div className="font-display font-extrabold text-3xl text-navy tabular-nums">
            <AnimatedStatValue value={s.value} shouldAnimate={isInView} />
          </div>
          <div className="text-xs text-muted mt-1">{t(`data.stats.${s.label}`)}</div>
        </motion.div>
      ))}
    </div>
  );
}
