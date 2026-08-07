import PhotoFrame from "../components/PhotoFrame";
import { ShieldCheck, HeartHandshake, Sparkle, Users } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import aboutHeroImg from "../assets/images/about-hero-equipe.jpg";
import aboutEditoImg from "../assets/images/about-edito-equipe.jpg";

const values = [
  { icon: Sparkle, key: "excellence" },
  { icon: HeartHandshake, key: "integrity" },
  { icon: ShieldCheck, key: "security" },
  { icon: Users, key: "proximity" },
];

// ⚠️ À COMPLÉTER : remplacez par les vrais membres de l'équipe MN3J-GROUP.
const team = [
  { roleKey: "ceo" },
  { roleKey: "training" },
  { roleKey: "btp" },
  { roleKey: "decoration" },
];

export default function About() {
  const { t } = useLanguage();
  const certifications = t("about.certificationsList");

  return (
    <div>
      <PhotoFrame tone="navy" src={aboutHeroImg} alt={t("about.heroLabel")} label={t("about.heroLabel")} className="h-64">
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container-page pb-10">
            <span className="eyebrow text-[#A9E072]">{t("about.eyebrowCompany")}</span>
            <h1 className="text-white text-3xl md:text-4xl font-bold mt-2">{t("about.title")}</h1>
            <p className="text-white/80 mt-2 max-w-lg text-sm">{t("about.subtitle")}</p>
          </div>
        </div>
      </PhotoFrame>

      <section className="container-page py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow">{t("about.editoEyebrow")}</span>
          <span className="block text-[10px] uppercase tracking-[0.2em] text-muted mt-1">
            {t("about.editoAccent")}
          </span>
          <h2 className="text-2xl text-navy font-display font-semibold mt-2">
            {t("about.editoTitle")}
          </h2>
          {/* ⚠️ À COMPLÉTER : précisez la biographie et les qualifications exactes du gérant et des responsables. */}
          <p className="text-muted text-sm leading-relaxed mt-4">{t("about.editoText")}</p>
        </div>
        <PhotoFrame tone="green" src={aboutEditoImg} alt={t("about.editoImageLabel")} label={t("about.editoImageLabel")} className="h-72 rounded-lg" />
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="eyebrow">{t("about.valuesEyebrow")}</span>
            <h2 className="text-2xl text-navy font-display font-semibold mt-2">
              {t("about.valuesTitle")}
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, key }) => (
              <div key={key} className="bg-white border border-black/5 rounded-md p-6">
                <div className="w-11 h-11 rounded-lg bg-navy flex items-center justify-center mb-4">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="text-navy font-semibold text-sm">{t(`about.values.${key}.title`)}</h3>
                <p className="text-muted text-xs leading-relaxed mt-2">{t(`about.values.${key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="max-w-xl mx-auto text-center mb-12">
          <span className="eyebrow">{t("about.teamEyebrow")}</span>
          <h2 className="text-2xl text-navy font-display font-semibold mt-2">
            {t("about.teamTitle")}
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {team.map((m) => (
            <div key={m.roleKey} className="text-center">
              <PhotoFrame tone="navy" className="h-40 w-40 rounded-full mx-auto mb-4" />
              <h4 className="text-navy font-semibold text-sm">{t("about.teamPlaceholderName")}</h4>
              <p className="text-muted text-xs mt-1">{t(`about.roles.${m.roleKey}`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-dark py-16">
        <div className="container-page">
          <div className="max-w-xl mx-auto text-center mb-10">
            <span className="eyebrow">{t("about.certificationsEyebrow")}</span>
            <h2 className="text-2xl text-white font-display font-semibold mt-2">
              {t("about.certificationsTitle")}
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {certifications.map((c) => (
              <div key={c} className="border border-white/10 rounded-md p-5 text-center text-white/90 text-sm">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
