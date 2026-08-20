import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Seo from "../components/Seo";
import { useLanguage } from "../i18n/LanguageContext";

export default function ThankYou() {
  const { t } = useLanguage();

  return (
    <div className="container-page py-32 text-center">
      <Seo title={t("seo.thankYou.title")} description={t("seo.thankYou.description")} />

      <div className="w-16 h-16 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={28} className="text-green-dark" />
      </div>
      <span className="eyebrow">{t("thankYou.eyebrow")}</span>
      <h1 className="text-navy text-3xl md:text-4xl font-display font-bold mt-3">{t("thankYou.title")}</h1>
      <p className="text-muted text-sm mt-4 max-w-md mx-auto leading-relaxed">{t("thankYou.text")}</p>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Link to="/" className="btn-primary">
          {t("thankYou.backHome")}
        </Link>
        <Link to="/chantiers" className="btn-dark">
          {t("thankYou.viewProjects")}
        </Link>
      </div>
    </div>
  );
}
