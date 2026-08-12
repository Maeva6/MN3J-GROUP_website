import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Seo from "../components/Seo";
import { useLanguage } from "../i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="container-page py-32 text-center">
      <Seo title={t("seo.notFound.title")} description={t("seo.notFound.description")} />

      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-6">
        <Compass size={26} className="text-navy" />
      </div>
      <span className="eyebrow">{t("notFound.eyebrow")}</span>
      <h1 className="text-navy text-3xl md:text-4xl font-display font-bold mt-3">{t("notFound.title")}</h1>
      <p className="text-muted text-sm mt-4 max-w-md mx-auto leading-relaxed">{t("notFound.text")}</p>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Link to="/" className="btn-primary">
          {t("notFound.backHome")}
        </Link>
        <Link to="/chantiers" className="btn-dark">
          {t("notFound.backProjects")}
        </Link>
      </div>
    </div>
  );
}
