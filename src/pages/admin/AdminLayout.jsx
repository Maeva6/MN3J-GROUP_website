import { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  HardHat,
  FileText,
  Users,
  CalendarDays,
  Image,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Bell,
  Plus,
  Menu,
  X,
} from "lucide-react";
import logo from "../../assets/images/logo.jpeg";
import { logoutAdmin } from "../../utils/adminAuth";
import { projects } from "../../data/projects";
import { quotes } from "../../data/adminData";
import { AdminHeaderProvider, useAdminHeaderState } from "./AdminHeaderContext";
import { AdminToastProvider } from "./AdminToastContext";

// Deux sections, comme la maquette : PILOTAGE (activité commerciale et
// opérationnelle) puis CONTENU DU SITE (ce qui alimente les pages publiques).
const navMain = [
  { to: "/admin", end: true, icon: LayoutGrid, label: "Tableau de bord" },
  { to: "/admin/chantiers", icon: HardHat, label: "Chantiers" },
  { to: "/admin/devis", icon: FileText, label: "Devis" },
  { to: "/admin/clients", icon: Users, label: "Clients" },
  { to: "/admin/planning", icon: CalendarDays, label: "Planning" },
];
const navContent = [
  { to: "/admin/media", icon: Image, label: "Médiathèque" },
  { to: "/admin/parametres", icon: Settings, label: "Paramètres" },
];

const titles = {
  "/admin": "Tableau de bord",
  "/admin/chantiers": "Chantiers",
  "/admin/devis": "Devis",
  "/admin/clients": "Clients",
  "/admin/planning": "Planning",
  "/admin/media": "Médiathèque",
  "/admin/parametres": "Paramètres",
};
const subtitles = {
  "/admin": "Pilotage",
  "/admin/chantiers": "Gestion",
  "/admin/devis": "Commercial",
  "/admin/clients": "Commercial",
  "/admin/planning": "Organisation",
  "/admin/media": "Contenu du site",
  "/admin/parametres": "Configuration",
};

function NavItem({ to, end, icon: Icon, label, badge, onNavigate }) {
  return (
    <NavLink
      key={label}
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
          isActive ? "bg-green/15 text-white font-semibold" : "text-white/70 hover:bg-white/5"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute -left-3 top-2 bottom-2 w-[3px] rounded-r-full bg-green transition-opacity ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <Icon size={16} className={isActive ? "text-green" : ""} />
          {label}
          {badge != null && badge !== "" && (
            <span
              className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isActive ? "bg-white/15 text-white" : "bg-white/10 text-white/80"
              }`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const title = titles[normalizedPath] || "Espace Admin";
  const subtitle = subtitles[normalizedPath] || "Espace administration";

  const newQuotes = quotes.filter((q) => q.status === "Nouveau").length;

  // Sidebar en tiroir sous le point de rupture lg (la largeur fixe w-64 ne
  // laisse quasiment rien au contenu sur téléphone) : fermée par défaut,
  // ouverte via le bouton menu du header, refermée automatiquement à chaque
  // changement de page.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const logout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <AdminToastProvider>
    <div className="lg:flex min-h-screen bg-surface">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-navy-dark/60 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy-dark text-white flex flex-col shrink-0 h-screen px-3 py-6 overflow-y-auto transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-2.5 pb-6 border-b border-white/10">
          <img src={logo} alt="MN3J-GROUP" className="h-9 w-9 object-cover object-top rounded-md bg-white shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-sm leading-tight">
              MN3J<span className="text-green">-</span>GROUP
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">Espace administration</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white p-1 shrink-0"
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="text-[10.5px] font-semibold tracking-[0.12em] text-white/40 px-3 pt-5 pb-2">PILOTAGE</div>
        <nav className="flex flex-col gap-1">
          <NavItem {...navMain[0]} onNavigate={() => setSidebarOpen(false)} />
          <NavItem {...navMain[1]} badge={String(projects.length)} onNavigate={() => setSidebarOpen(false)} />
          <NavItem {...navMain[2]} badge={newQuotes ? String(newQuotes) : null} onNavigate={() => setSidebarOpen(false)} />
          <NavItem {...navMain[3]} onNavigate={() => setSidebarOpen(false)} />
          <NavItem {...navMain[4]} onNavigate={() => setSidebarOpen(false)} />
        </nav>

        <div className="text-[10.5px] font-semibold tracking-[0.12em] text-white/40 px-3 pt-6 pb-2">CONTENU DU SITE</div>
        <nav className="flex flex-col gap-1">
          {navContent.map((item) => (
            <NavItem key={item.label} {...item} onNavigate={() => setSidebarOpen(false)} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-white/15 rounded-lg text-white/80 text-[13px] font-semibold hover:border-green/60 hover:text-white transition-colors"
          >
            Voir le site public <ExternalLink size={14} />
          </Link>
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/5">
            <span className="w-9 h-9 rounded-full bg-green text-[#12310F] font-bold text-xs flex items-center justify-center shrink-0">
              MN
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate">Moussa N'Guessan</div>
              <div className="text-[11.5px] text-white/50">Administrateur</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 py-2 text-white/60 text-[13px] hover:text-white transition-colors"
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <AdminHeaderProvider>
        <div className="flex-1 min-w-0">
          <HeaderBar subtitle={subtitle} title={title} onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
            <Outlet />
          </div>
        </div>
      </AdminHeaderProvider>
    </div>
    </AdminToastProvider>
  );
}

// Lit les actions déclarées par la page affichée (recherche, bouton "Nouveau")
// via le contexte — voir AdminHeaderContext.jsx.
function HeaderBar({ subtitle, title, onMenuClick }) {
  const actions = useAdminHeaderState();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-black/5 px-4 sm:px-6 lg:px-8 py-3.5 lg:py-4 flex items-center gap-3 lg:gap-5 flex-wrap">
      <button
        onClick={onMenuClick}
        className="lg:hidden shrink-0 w-10 h-10 rounded-lg border border-black/5 bg-white flex items-center justify-center text-navy"
        aria-label="Ouvrir le menu"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 min-w-[160px]">
        {actions?.greeting ? (
          <>
            <div className="text-[12.5px] text-muted capitalize">{actions.dateLabel}</div>
            <h1 className="text-navy font-display font-bold text-lg lg:text-xl mt-0.5">{actions.greeting}</h1>
          </>
        ) : (
          <>
            <div className="text-[12.5px] text-muted">{subtitle}</div>
            <h1 className="text-navy font-display font-bold text-lg lg:text-xl mt-0.5">{title}</h1>
          </>
        )}
      </div>

      {actions?.showSearch && (
        <div className="flex items-center gap-2 bg-surface border border-black/5 rounded-lg px-3 py-2.5 w-full sm:w-60 max-w-full order-last sm:order-none">
          <Search size={15} className="text-muted shrink-0" />
          <input
            value={actions.searchValue || ""}
            onChange={(e) => actions.onSearchChange?.(e.target.value)}
            placeholder={actions.searchPlaceholder || "Rechercher…"}
            className="bg-transparent outline-none text-[13.5px] flex-1 min-w-0 text-ink"
          />
        </div>
      )}

      <span className="relative w-10 h-10 rounded-lg border border-black/5 bg-white flex items-center justify-center shrink-0" aria-hidden="true">
        <Bell size={17} className="text-[#3a4550]" />
        <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-green admin-bell-dot" />
      </span>

      {actions?.newLabel && actions?.onNew && (
        <button
          onClick={actions.onNew}
          className="inline-flex items-center gap-2 bg-green text-[#12310F] font-bold text-[13.5px] px-4 py-2.5 rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green/30 transition-all shrink-0 whitespace-nowrap"
        >
          <Plus size={16} /> {actions.newLabel}
        </button>
      )}
    </header>
  );
}
