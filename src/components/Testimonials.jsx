import { Star, Quote } from "lucide-react";
import { testimonials } from "../data/testimonials";
import { useLanguage } from "../i18n/LanguageContext";

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="section container-page py-24">
      <div className="max-w-xl mx-auto text-center mb-14">
        <span className="eyebrow">{t("home.testimonials.eyebrow")}</span>
        <h2 className="text-3xl text-navy mt-3">{t("home.testimonials.title")}</h2>
        <p className="text-muted mt-3 text-sm leading-relaxed">{t("home.testimonials.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map(({ id, name, role, poleId, rating }) => (
          <div key={id} className="bg-white border border-black/5 rounded-lg p-7 relative">
            <Quote size={28} className="text-green/30" />
            <div className="flex items-center gap-1 mt-3 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < rating ? "text-green fill-green" : "text-black/10 fill-black/10"}
                />
              ))}
            </div>
            <p className="text-ink text-sm leading-relaxed italic">
              « {t(`data.testimonials.${id}.quote`)} »
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="w-10 h-10 rounded-full bg-navy text-white text-xs font-semibold flex items-center justify-center shrink-0">
                {initials(name)}
              </span>
              <div>
                <p className="text-navy text-sm font-semibold">{name}</p>
                <p className="text-muted text-xs">{role}</p>
              </div>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-blue font-semibold self-start mt-1">
                {t(`data.services.${poleId}.tagline`)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
