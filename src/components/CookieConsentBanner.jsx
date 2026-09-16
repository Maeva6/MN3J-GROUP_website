import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookieConsent, setCookieConsent } from "../utils/cookieConsent";
import { initAnalytics, trackPageview } from "../lib/analytics";
import { useLanguage } from "../i18n/LanguageContext";

export default function CookieConsentBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  const accept = () => {
    setCookieConsent("accepted");
    setVisible(false);
    initAnalytics();
    trackPageview(window.location.pathname);
  };

  const decline = () => {
    setCookieConsent("declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] bg-navy-dark text-white px-6 py-4 shadow-card">
      <div className="container-page flex flex-col sm:flex-row items-center gap-4">
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed flex-1">
          {t("cookieBanner.message")}{" "}
          <Link to="/politique-de-confidentialite" className="underline hover:text-white">
            {t("cookieBanner.learnMore")}
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={decline}
            className="text-xs sm:text-sm font-semibold text-white/80 hover:text-white px-4 py-2"
          >
            {t("cookieBanner.decline")}
          </button>
          <button
            type="button"
            onClick={accept}
            className="text-xs sm:text-sm font-semibold bg-green text-[#12310F] hover:bg-green-dark hover:text-white transition-colors rounded px-5 py-2"
          >
            {t("cookieBanner.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
