import { Link, useLocation } from "react-router-dom";
import { FileText, Phone } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { useLanguage } from "../i18n/LanguageContext";

// Boutons d'action flottants (mobile uniquement) : le CTA de la navbar
// disparaît derrière le menu hamburger sur petit écran, donc ces bulles
// gardent la prise de contact accessible pendant le défilement. Flottants
// (pas une barre pleine largeur) : ils se posent par-dessus le contenu sans
// réserver d'espace, donc sans créer de bande vide sous le Footer.
// - Bouton "devis" : partout, sauf sur les pages qui ont déjà leur propre
//   demande de devis (contact, merci) ou qui n'en ont pas besoin (admin).
// - Bouton "appel" : uniquement sur la page d'accueil, pour ne pas surcharger
//   les autres pages d'un deuxième bouton flottant.
export default function StickyMobileCta() {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const showQuoteButton = !["/contact", "/merci"].includes(pathname) && !pathname.startsWith("/admin");

  if (!isHome && !showQuoteButton) return null;

  return (
    <div className="md:hidden fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {isHome && (
        <a
          href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
          aria-label={t("common.call")}
          className="w-[52px] h-[52px] shrink-0 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-black/10 flex items-center justify-center text-navy"
        >
          <Phone size={20} />
        </a>
      )}
      {showQuoteButton && (
        <Link
          to="/contact"
          aria-label={t("common.requestQuote")}
          className="w-14 h-14 shrink-0 rounded-full bg-green shadow-[0_4px_16px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#12310F]"
        >
          <FileText size={22} />
        </Link>
      )}
    </div>
  );
}
