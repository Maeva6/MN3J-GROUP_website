import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../assets/images/logo.jpeg";
import { useLanguage } from "../i18n/LanguageContext";
import { services, maintenanceService } from "../data/services";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/chantiers", label: t("nav.projects") },
    { to: "/a-propos", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="container-page flex items-center justify-between h-20">
        <NavLink to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          {/* Icône seule recadrée via object-position pour éviter d'écraser le texte du logo */}
          <img src={logo} alt="MN3J-GROUP" className="h-10 w-10 object-cover object-top rounded" />
          <span className="font-display font-bold text-navy text-lg tracking-tight">
            MN3J<span className="text-green">-</span>GROUP
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-navy font-semibold" : "hover:text-navy transition-colors"
            }
          >
            {t("nav.home")}
          </NavLink>
          <NavLink
            to="/chantiers"
            className={({ isActive }) =>
              isActive ? "text-navy font-semibold" : "hover:text-navy transition-colors"
            }
          >
            {t("nav.projects")}
          </NavLink>

          {/* Services : menu déroulant sur les rubriques */}
          <div className="relative group">
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `inline-flex items-center gap-1 ${
                  isActive ? "text-navy font-semibold" : "hover:text-navy transition-colors"
                }`
              }
            >
              {t("nav.services")}
              <ChevronDown size={14} className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </NavLink>

            <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-150 absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[600px] z-40">
              <div className="bg-white rounded-lg shadow-card border border-black/5 p-5">
                <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">
                  {t("nav.servicesMenuTitle")}
                </span>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {services.map(({ id, icon: Icon }) => (
                    <Link
                      key={id}
                      to={`/services#${id}`}
                      className="flex items-start gap-3 p-2.5 rounded-md hover:bg-surface transition-colors"
                    >
                      <span className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-white" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-navy">
                          {t(`data.services.${id}.title`)}
                        </span>
                        <span className="block text-xs text-muted mt-0.5 leading-snug">
                          {t(`data.services.${id}.navBlurb`)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-black/5 mt-4 pt-3 flex items-center justify-between">
                  <Link
                    to={`/services#${maintenanceService.id}`}
                    className="text-xs font-semibold text-green-dark hover:underline"
                  >
                    {t("nav.maintenanceCta")}
                  </Link>
                  <Link to="/services" className="text-xs font-semibold text-blue hover:underline">
                    {t("nav.viewAllServices")}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <NavLink
            to="/a-propos"
            className={({ isActive }) =>
              isActive ? "text-navy font-semibold" : "hover:text-navy transition-colors"
            }
          >
            {t("nav.about")}
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-navy font-semibold" : "hover:text-navy transition-colors"
            }
          >
            {t("nav.contact")}
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div
            role="group"
            aria-label="Choix de la langue"
            className="flex items-center text-xs font-semibold border border-black/10 rounded-full overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setLang("fr")}
              aria-pressed={lang === "fr"}
              className={`px-3 py-1 transition-colors ${
                lang === "fr" ? "bg-navy text-white" : "text-muted hover:text-navy"
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`px-3 py-1 transition-colors ${
                lang === "en" ? "bg-navy text-white" : "text-muted hover:text-navy"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <button
          className="md:hidden text-navy"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("nav.openMenu")}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <nav className="container-page py-4 flex flex-col gap-4 text-sm font-medium">
            {links.slice(0, 2).map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-ink">
                {l.label}
              </NavLink>
            ))}

            <div>
              <button
                type="button"
                onClick={() => setMobileServicesOpen((v) => !v)}
                className="w-full flex items-center justify-between text-ink"
              >
                {t("nav.services")}
                <ChevronDown size={16} className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileServicesOpen && (
                <div className="mt-3 pl-3 border-l border-black/10 flex flex-col gap-3">
                  {services.map(({ id }) => (
                    <Link
                      key={id}
                      to={`/services#${id}`}
                      onClick={() => setOpen(false)}
                      className="text-muted text-sm"
                    >
                      {t(`data.services.${id}.title`)}
                    </Link>
                  ))}
                  <Link
                    to={`/services#${maintenanceService.id}`}
                    onClick={() => setOpen(false)}
                    className="text-green-dark text-sm font-semibold"
                  >
                    {t("nav.maintenanceCta")}
                  </Link>
                </div>
              )}
            </div>

            {links.slice(2).map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-ink">
                {l.label}
              </NavLink>
            ))}

            <div
              role="group"
              aria-label="Choix de la langue"
              className="flex items-center w-fit text-xs font-semibold border border-black/10 rounded-full overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setLang("fr")}
                aria-pressed={lang === "fr"}
                className={`px-3 py-1.5 transition-colors ${
                  lang === "fr" ? "bg-navy text-white" : "text-muted"
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`px-3 py-1.5 transition-colors ${
                  lang === "en" ? "bg-navy text-white" : "text-muted"
                }`}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
