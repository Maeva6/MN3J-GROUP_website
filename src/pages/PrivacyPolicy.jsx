import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { siteConfig } from "../data/siteConfig";
import { useLanguage } from "../i18n/LanguageContext";

// ⚠️ Contenu de base à faire relire par un professionnel du droit avant mise
// en ligne définitive — voir la note "légal" dans le README.
export default function PrivacyPolicy() {
  const { t } = useLanguage();
  const mentionsSections = t("legalPage.mentions.sections");
  const privacySections = t("legalPage.privacy.sections");

  return (
    <div className="container-page py-16 max-w-3xl">
      <Seo title={t("seo.legal.title")} description={t("seo.legal.description")} />

      <span className="eyebrow">{t("legalPage.eyebrow")}</span>
      <h1 className="text-3xl text-navy font-display font-semibold mt-2">{t("legalPage.title")}</h1>

      <section className="mt-10">
        <h2 className="text-navy font-display font-semibold text-xl mb-4">{t("legalPage.mentions.title")}</h2>
        <div className="space-y-4 text-sm text-muted leading-relaxed">
          {mentionsSections.map((s) => (
            <div key={s.title}>
              <h3 className="text-ink font-semibold text-sm mb-1">{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-navy font-display font-semibold text-xl mb-2">{t("legalPage.privacy.title")}</h2>
        <p className="text-muted text-sm mb-6 leading-relaxed">{t("legalPage.privacy.intro")}</p>
        <div className="space-y-6">
          {privacySections.map((s, i) => (
            <div key={s.title}>
              <h3 className="text-ink font-semibold text-sm mb-1">
                {i + 1}. {s.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="text-muted text-sm leading-relaxed mt-6">
          {t("legalPage.privacy.contactPrefix")}{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-blue font-semibold hover:underline">
            {siteConfig.email}
          </a>
          {" · "}
          <Link to="/contact" className="text-blue font-semibold hover:underline">
            {t("legalPage.privacy.contactLink")}
          </Link>
        </p>
      </section>
    </div>
  );
}
