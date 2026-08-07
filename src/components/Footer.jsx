import { Link } from "react-router-dom";
import logo from "../assets/images/logo.jpeg";
import SocialIcons from "./SocialIcons";
import { siteConfig } from "../data/siteConfig";
import { useLanguage } from "../i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-dark text-[#C4CEDE]">
      <div className="container-page py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="MN3J-GROUP" className="h-8 w-8 object-cover object-top rounded" />
            <span className="font-display font-bold text-white">MN3J-GROUP</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">{t("footer.tagline")}</p>
        </div>

        <div className="text-sm">
          <h4 className="text-white font-semibold mb-3">{t("footer.navigationTitle")}</h4>
          <ul className="space-y-2">
            <li><Link to="/chantiers" className="hover:text-white">{t("nav.projects")}</Link></li>
            <li><Link to="/services" className="hover:text-white">{t("nav.services")}</Link></li>
            <li><Link to="/a-propos" className="hover:text-white">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <h4 className="text-white font-semibold mb-3">{t("footer.followTitle")}</h4>
          <SocialIcons variant="dark" />
          <p className="mt-4 text-xs text-[#8FA0BC]">
            {siteConfig.email}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-[#8FA0BC] flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} MN3J-GROUP Sarl. {t("footer.rights")}</span>
          <span>{t("footer.legal")}</span>
        </div>
      </div>
    </footer>
  );
}
