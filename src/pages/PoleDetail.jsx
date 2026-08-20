import { useParams, Link } from "react-router-dom";
import PhotoFrame from "../components/PhotoFrame";
import Seo from "../components/Seo";
import NotFound from "./NotFound";
import { services, maintenanceService } from "../data/services";
import { useLanguage } from "../i18n/LanguageContext";

export default function PoleDetail() {
  const { poleId } = useParams();
  const { t } = useLanguage();
  const pole = services.find((s) => s.id === poleId) || (poleId === maintenanceService.id ? maintenanceService : null);

  if (!pole) {
    return <NotFound />;
  }

  const isMaintenance = pole.id === maintenanceService.id;
  const subItems = t(`data.services.${pole.id}.subItems`);
  const PoleIcon = pole.icon;

  return (
    <div>
      <Seo
        title={`${t(`data.services.${pole.id}.title`)} — MN3J-GROUP`}
        description={t(`data.services.${pole.id}.description`)}
      />

      <PhotoFrame
        tone="dusk"
        src={pole.image}
        alt={t(`data.services.${pole.id}.title`)}
        className="h-72"
      >
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container-page pb-10">
            <span className="eyebrow text-[#A9E072]">{t(`data.services.${pole.id}.tagline`)}</span>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <PoleIcon size={18} className="text-white" />
              </span>
              <h1 className="text-white text-3xl md:text-4xl font-bold">
                {t(`data.services.${pole.id}.title`)}
              </h1>
              <span className="text-[10px] uppercase tracking-wider text-white/80 font-semibold border border-white/30 rounded-full px-2 py-0.5">
                {t(`data.services.${pole.id}.accent`)}
              </span>
              {pole.brand && (
                <span className="text-[10px] uppercase tracking-wider text-[#12310F] font-bold bg-green rounded-full px-2.5 py-0.5">
                  {pole.brand}
                </span>
              )}
            </div>
            <p className="text-white/80 mt-2 max-w-lg text-sm">
              {t(`data.services.${pole.id}.description`)}
            </p>
          </div>
        </div>
      </PhotoFrame>

      {/* Section à part entière pour les pôles portés par une marque dédiée
          (ex. Formation → ASCII), pour ne jamais la confondre avec les autres
          pôles MN3J-GROUP — cohérent avec la page Chantiers. */}
      {pole.brand && (
        <div className="container-page pt-10">
          <div className="border-2 border-green/25 rounded-2xl bg-green/5 p-6 md:p-8 flex flex-wrap items-center gap-5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-green-dark bg-green rounded-full px-3 py-1 shrink-0">
              {pole.brand}
            </span>
            <p className="text-ink text-sm max-w-2xl">
              {t(`data.services.${pole.id}.brandNote`)}
            </p>
          </div>
        </div>
      )}

      <div className="container-page py-16">
        <div className="max-w-xl mx-auto text-center mb-12">
          <span className="eyebrow">{t("services.subTypesTitle")}</span>
          <h2 className="text-2xl text-navy font-display font-semibold mt-2">
            {t(`data.services.${pole.id}.title`)}
          </h2>
        </div>

        {isMaintenance ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {subItems.map((item) => (
              <div key={item.title} className="bg-white border border-black/5 rounded-md p-5">
                <h4 className="text-navy font-semibold text-sm">{item.title}</h4>
                <p className="text-muted text-xs leading-relaxed mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {subItems.map((item) => (
              <Link
                key={item.id}
                to={`/services/${pole.id}/${item.id}`}
                className="group block rounded-lg overflow-hidden border border-black/5 bg-white hover:shadow-card transition-shadow"
              >
                <PhotoFrame
                  src={pole.subImages[item.id]}
                  alt={item.title}
                  label={item.title}
                  tone="navy"
                  objectPosition={pole.subImageFocus?.[item.id] ?? "center"}
                  className="h-44 group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="p-5">
                  <h3 className="font-display font-semibold text-navy text-base">{item.title}</h3>
                  <p className="text-muted text-xs leading-relaxed mt-2">{item.description}</p>
                  <span className="text-blue text-sm font-semibold mt-3 inline-block">
                    {t("services.discoverCta")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pole.id === "piscines" && (
          <div className="mt-10 border border-black/5 rounded-lg p-6 bg-surface flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h4 className="text-navy font-semibold text-sm">{t("data.services.entretien.title")}</h4>
              <p className="text-muted text-xs mt-1 max-w-md">{t("data.services.entretien.description")}</p>
            </div>
            <Link to={`/services/${maintenanceService.id}`} className="text-green-dark font-semibold text-sm shrink-0">
              {t("services.discoverCta")}
            </Link>
          </div>
        )}
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
