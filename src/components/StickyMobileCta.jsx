import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { useLanguage } from "../i18n/LanguageContext";

// Barre d'action fixée en bas de l'écran, visible uniquement sur mobile : le
// CTA de la navbar disparaît derrière le menu hamburger sur petit écran, donc
// cette barre garde la prise de contact accessible en permanence pendant le
// défilement. Masquée sur les pages où elle serait redondante (contact, merci).
export default function StickyMobileCta() {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  if (pathname === "/contact" || pathname === "/merci" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/10 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-3">
      <a
        href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
        aria-label={t("common.call")}
        className="w-11 h-11 shrink-0 rounded-full border border-black/10 flex items-center justify-center text-navy"
      >
        <Phone size={18} />
      </a>
      <Link to="/contact" className="btn-primary flex-1 justify-center">
        {t("common.requestQuote")}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
