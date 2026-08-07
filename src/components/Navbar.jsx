import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../assets/images/logo.jpeg";
import { useLanguage } from "../i18n/LanguageContext";
import { services, maintenanceService } from "../data/services";

function PoleDropdown({ pole, t }) {
  const subItems = t(`data.services.${pole.id}.subItems`);
  return (
    <div className="relative group">
      <NavLink
        to={`/services/${pole.id}`}
        className={({ isActive }) =>
          `inline-flex items-center gap-1 ${
            isActive ? "text-navy font-semibold" : "hover:text-navy transition-colors"
          }`
        }
      >
        {t(`data.services.${pole.id}.title`)}
        <ChevronDown size={14} className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </NavLink>

      <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-150 absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72 z-40">
        <div className="bg-white rounded-lg shadow-card border border-black/5 p-4">
          <ul className="space-y-1">
            {subItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/services/${pole.id}/${item.id}`}
                  className="block px-2.5 py-2 rounded-md hover:bg-surface transition-colors text-sm text-ink"
                >
                  {item.title}
                </Link>
              </li>
            ))}
            {pole.id === "piscines" && (
              <li>
                <Link
                  to={`/services/${maintenanceService.id}`}
                  className="block px-2.5 py-2 rounded-md hover:bg-surface transition-colors text-sm text-green-dark font-semibold"
                >
                  {t("data.services.entretien.title")}
                </Link>
              </li>
            )}
          </ul>
          <div className="border-t border-black/5 mt-2 pt-2">
            <Link to={`/services/${pole.id}`} className="text-xs font-semibold text-blue hover:underline px-2.5">
              {t("services.discoverCta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobilePoleOpen, setMobilePoleOpen] = useState(null);
  const { lang, setLang, t } = useLanguage();

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

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted">
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

          {services.map((pole) => (
            <PoleDropdown key={pole.id} pole={pole} t={t} />
          ))}

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

        <div className="hidden lg:flex items-center gap-4">
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
          className="lg:hidden text-navy"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("nav.openMenu")}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-black/5 bg-white">
          <nav className="container-page py-4 flex flex-col gap-4 text-sm font-medium">
            <NavLink to="/" onClick={() => setOpen(false)} className="text-ink">
              {t("nav.home")}
            </NavLink>
            <NavLink to="/chantiers" onClick={() => setOpen(false)} className="text-ink">
              {t("nav.projects")}
            </NavLink>

            {services.map((pole) => {
              const subItems = t(`data.services.${pole.id}.subItems`);
              const isOpen = mobilePoleOpen === pole.id;
              return (
                <div key={pole.id}>
                  <button
                    type="button"
                    onClick={() => setMobilePoleOpen(isOpen ? null : pole.id)}
                    className="w-full flex items-center justify-between text-ink"
                  >
                    {t(`data.services.${pole.id}.title`)}
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="mt-3 pl-3 border-l border-black/10 flex flex-col gap-3">
                      {subItems.map((item) => (
                        <Link
                          key={item.id}
                          to={`/services/${pole.id}/${item.id}`}
                          onClick={() => setOpen(false)}
                          className="text-muted text-sm"
                        >
                          {item.title}
                        </Link>
                      ))}
                      {pole.id === "piscines" && (
                        <Link
                          to={`/services/${maintenanceService.id}`}
                          onClick={() => setOpen(false)}
                          className="text-green-dark text-sm font-semibold"
                        >
                          {t("data.services.entretien.title")}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <NavLink to="/a-propos" onClick={() => setOpen(false)} className="text-ink">
              {t("nav.about")}
            </NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} className="text-ink">
              {t("nav.contact")}
            </NavLink>

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
