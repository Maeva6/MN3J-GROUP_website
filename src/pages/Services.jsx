import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import PhotoFrame from "../components/PhotoFrame";
import { services, maintenanceService } from "../data/services";
import { useLanguage } from "../i18n/LanguageContext";
import servicesHeroImg from "../assets/images/services-piscine-vue.jpg";
import piscinesImg from "../assets/images/piscine-debordement.jpg";
import decorationImg from "../assets/images/decoration-terrasse.jpg";
import btpImg from "../assets/images/btp-chantier.jpg";
import formationImg from "../assets/images/formation-natation.jpg";
import entretienImg from "../assets/images/entretien-eau.jpg";

const serviceImages = {
  piscines: piscinesImg,
  decoration: decorationImg,
  btp: btpImg,
  formation: formationImg,
};

export default function Services() {
  const { t } = useLanguage();
  const MaintenanceIcon = maintenanceService.icon;

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

      <div className="container-page py-16 space-y-20">
        {services.map((s, i) => (
          <div
            key={s.id}
            id={s.id}
            className={`grid md:grid-cols-2 gap-10 items-center scroll-mt-28 ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <PhotoFrame
              tone={i % 2 === 0 ? "navy" : "green"}
              src={serviceImages[s.id]}
              alt={t(`data.services.${s.id}.title`)}
              label={t(`data.services.${s.id}.title`)}
              className="h-72 rounded-lg"
            />
            <div>
              <span className="eyebrow">
                {s.number} — {t(`data.services.${s.id}.tagline`)}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <h2 className="text-2xl text-navy font-display font-semibold">
                  {t(`data.services.${s.id}.title`)}
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-blue font-semibold border border-blue/20 rounded-full px-2 py-0.5">
                  {t(`data.services.${s.id}.accent`)}
                </span>
              </div>
              <p className="text-muted text-sm leading-relaxed mt-3">
                {t(`data.services.${s.id}.description`)}
              </p>

              <ul className="mt-5 space-y-3">
                {t(`data.services.${s.id}.subItems`).map((item) => (
                  <li key={item.title} className="flex gap-2 text-sm text-ink">
                    <span className="w-5 h-5 rounded-full bg-green/15 text-green-dark flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} />
                    </span>
                    <span>
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-muted"> — {item.description}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/contact" className="text-green-dark font-semibold text-sm mt-6 inline-block">
                {t("common.requestQuote")} →
              </Link>
            </div>
          </div>
        ))}

        {/* Entretien : rubrique complémentaire, présentation dédiée */}
        <div id={maintenanceService.id} className="scroll-mt-28 bg-surface rounded-lg p-8 md:p-12 grid md:grid-cols-[1.3fr,1fr] gap-10 items-start">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-lg bg-navy flex items-center justify-center shrink-0">
                <MaintenanceIcon size={18} className="text-white" />
              </span>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl text-navy font-display font-semibold">
                  {t(`data.services.${maintenanceService.id}.title`)}
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-blue font-semibold border border-blue/20 rounded-full px-2 py-0.5">
                  {t(`data.services.${maintenanceService.id}.accent`)}
                </span>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed mt-4 max-w-2xl">
              {t(`data.services.${maintenanceService.id}.description`)}
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {t(`data.services.${maintenanceService.id}.subItems`).map((item) => (
                <div key={item.title} className="bg-white border border-black/5 rounded-md p-4">
                  <h4 className="text-navy font-semibold text-sm">{item.title}</h4>
                  <p className="text-muted text-xs leading-relaxed mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <PhotoFrame
            src={entretienImg}
            alt={t(`data.services.${maintenanceService.id}.title`)}
            tone="navy"
            className="h-64 rounded-lg"
          />
        </div>
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
