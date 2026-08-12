import { useParams, Link } from "react-router-dom";
import { Check } from "lucide-react";
import PhotoFrame from "../components/PhotoFrame";
import Seo from "../components/Seo";
import { services } from "../data/services";
import { useLanguage } from "../i18n/LanguageContext";

export default function SubServiceDetail() {
  const { poleId, subId } = useParams();
  const { t } = useLanguage();
  const pole = services.find((s) => s.id === poleId);
  const subItems = pole ? t(`data.services.${pole.id}.subItems`) : [];
  const sub = subItems.find((i) => i.id === subId);

  if (!pole || !sub) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-muted">{t("projectDetail.notFound")}</p>
        <Link to="/services" className="text-blue font-semibold text-sm">
          {t("nav.home")}
        </Link>
      </div>
    );
  }

  const poleTitle = t(`data.services.${pole.id}.title`);
  const related = subItems.filter((i) => i.id !== sub.id);

  return (
    <div>
      <Seo title={`${sub.title} — ${poleTitle} | MN3J-GROUP`} description={sub.description} />

      <PhotoFrame src={pole.subImages[sub.id]} alt={sub.title} tone="navy" className="h-80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-page pb-8">
          <div className="text-xs text-white/70 flex items-center gap-1.5 mb-2">
            <Link to={`/services/${pole.id}`} className="hover:text-white hover:underline">{poleTitle}</Link>
            <span>/</span>
            <span>{sub.title}</span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-bold">{sub.title}</h1>
        </div>
      </PhotoFrame>

      <div className="container-page py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-navy font-display font-semibold text-xl mb-3">{t("projectDetail.descriptionTitle")}</h2>
            <p className="text-muted text-sm leading-relaxed">{sub.description}</p>
          </div>

          <div>
            <h2 className="text-navy font-display font-semibold text-xl mb-3">{t("services.advantagesTitle")}</h2>
            <ul className="space-y-3">
              {sub.advantages.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm text-ink">
                  <span className="w-5 h-5 rounded-full bg-green/15 text-green-dark flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-black/5 rounded-lg p-6 bg-surface">
            <h3 className="text-navy font-semibold text-sm mb-2">{t("services.quoteForThis")}</h3>
            <Link to="/contact" className="btn-primary w-full justify-center mt-2">
              {t("common.requestQuote")}
            </Link>
          </div>

          <div className="border border-black/5 rounded-lg p-6">
            <h3 className="text-navy font-semibold text-sm mb-4">{t("services.relatedTitle")}</h3>
            <ul className="space-y-3">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/services/${pole.id}/${item.id}`}
                    className="text-sm text-ink hover:text-blue transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
