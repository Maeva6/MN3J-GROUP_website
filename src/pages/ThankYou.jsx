import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Seo from "../components/Seo";
import { useLanguage } from "../i18n/LanguageContext";

export default function ThankYou() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden py-28 md:py-36">
      <Seo title={t("seo.thankYou.title")} description={t("seo.thankYou.description")} />

      {/* Halos décoratifs flottants, en écho aux dégradés du hero de l'accueil */}
      <motion.div
        aria-hidden
        className="absolute left-[8%] top-[10%] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(125,191,63,0.10),rgba(125,191,63,0)_70%)]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-[8%] bottom-[6%] w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(43,90,160,0.08),rgba(43,90,160,0)_70%)]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative container-page max-w-xl text-center flex flex-col items-center">
        {/* Badge succès : anneau qui pulse derrière une icône qui se dessine */}
        <div className="relative w-20 h-20">
          <motion.span
            aria-hidden
            className="absolute -inset-[17px] rounded-full bg-green/20"
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
          />
          <motion.div
            className="relative w-20 h-20 rounded-full bg-green/15 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.3, 1.4, 0.5, 1] }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#4C8420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                strokeDasharray={64}
                initial={{ strokeDashoffset: 64 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                transform="rotate(-90 12 12)"
              />
              <motion.path
                d="M8 12.5l2.7 2.7L16 9.8"
                strokeDasharray={40}
                initial={{ strokeDashoffset: 40 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.45, delay: 1, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </div>

        <motion.span
          className="eyebrow mt-11"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          {t("thankYou.eyebrow")}
        </motion.span>

        <motion.h1
          className="text-navy text-4xl md:text-5xl font-display font-bold mt-4 leading-tight"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.25 }}
        >
          {t("thankYou.title")}
        </motion.h1>

        <motion.p
          className="text-muted text-[17px] mt-5 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
        >
          {t("thankYou.text")}
        </motion.p>

        <motion.div
          className="w-[120px] h-[3px] bg-green rounded-full mt-7 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        />

        <motion.div
          className="flex flex-wrap items-center justify-center gap-5 mt-9"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.7 }}
        >
          <Link to="/" className="btn-primary transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green/35">
            {t("thankYou.backHome")}
          </Link>
          <Link to="/chantiers" className="btn-dark transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/30">
            {t("thankYou.viewProjects")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
