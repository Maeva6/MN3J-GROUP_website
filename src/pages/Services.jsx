import { Link } from "react-router-dom";
import PhotoFrame from "../components/PhotoFrame";
import { services, maintenanceService } from "../data/services";
import { useLanguage } from "../i18n/LanguageContext";
import servicesHeroImg from "../assets/images/services-piscine-vue.jpg";

export default function Services() {
  const { t } = useLanguage();

  return (
    <div>
      <PhotoFrame tone="dusk" src={servicesHeroImg} alt={t("services.heroLabel")} label={t("services.heroLabel")} className="h-64">
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container-page pb-10">
            <span className="eyebrow text-[#A9E072]">{t("services.eyebrow")}</span>
            <h1 className="text-white text-3xl md:text-4xl font-bold mt-2">{t("services.title")}</h1>
            <p className="text-white/80 mt-2 max-w-lg text-sm">{t("services.intro")}</p>
          </div>
        </div>
      </PhotoFrame>

      <div className="container-page py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((pole) => {
            const Icon = pole.icon;
            return (
              <Link
                key={pole.id}
                to={`/services/${pole.id}`}
                className="group flex gap-5 rounded-lg overflow-hidden border border-black/5 bg-white hover:shadow-card transition-shadow p-4"
              >
                <PhotoFrame
                  src={pole.image}
                  alt={t(`data.services.${pole.id}.title`)}
                  tone="navy"
                  className="w-32 h-32 rounded-md shrink-0 group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-white" />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-blue font-semibold">
                      {t(`data.services.${pole.id}.accent`)}
                    </span>
                  </div>
                  <h3 className="text-navy font-display font-semibold text-base mt-2">
                    {t(`data.services.${pole.id}.title`)}
                  </h3>
                  <p className="text-muted text-xs leading-relaxed mt-1">
                    {t(`data.services.${pole.id}.navBlurb`)}
                  </p>
                  <span className="text-blue text-sm font-semibold mt-2 inline-block">
                    {t("services.discoverCta")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <Link
          to={`/services/${maintenanceService.id}`}
          className="mt-6 flex items-center justify-between gap-4 flex-wrap border border-black/5 rounded-lg p-5 bg-surface hover:shadow-card transition-shadow"
        >
          <div>
            <h4 className="text-navy font-semibold text-sm">{t("data.services.entretien.title")}</h4>
            <p className="text-muted text-xs mt-1">{t("data.services.entretien.description")}</p>
          </div>
          <span className="text-green-dark font-semibold text-sm shrink-0">{t("services.discoverCta")}</span>
        </Link>
      </div>

      <div className="bg-green py-14">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[#12310F] text-2xl font-display font-bold">{t("common.ctaTitle")}</h3>
            <p className="text-[#20431A] text-sm mt-1">{t("common.ctaText")}</p>
          </div>
          <Link to="/contact" className="btn-dark">{t("common.requestQuote")}</Link>
        </div>
      </div>
    </div>
  );
}
