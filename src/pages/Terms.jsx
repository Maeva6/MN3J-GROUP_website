import Seo from "../components/Seo";
import { useLanguage } from "../i18n/LanguageContext";

// ⚠️ Contenu de base à faire relire par un professionnel du droit avant mise
// en ligne définitive — voir la note "légal" dans le README.
export default function Terms() {
  const { t } = useLanguage();
  const sections = t("termsPage.sections");

  return (
    <div className="container-page py-16 max-w-3xl">
      <Seo title={t("seo.terms.title")} description={t("seo.terms.description")} />

      <span className="eyebrow">{t("termsPage.eyebrow")}</span>
      <h1 className="text-3xl text-navy font-display font-semibold mt-2">{t("termsPage.title")}</h1>
      <p className="text-muted text-sm mt-4 leading-relaxed">{t("termsPage.intro")}</p>

      <div className="space-y-6 mt-10">
        {sections.map((s, i) => (
          <div key={s.title}>
            <h3 className="text-ink font-semibold text-sm mb-1">
              {i + 1}. {s.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
