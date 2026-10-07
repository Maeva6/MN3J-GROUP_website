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
} from "lucide-react";
import logo from "../../assets/images/logo.jpeg";
import { logoutAdmin } from "../../utils/adminAuth";
import { projects } from "../../data/projects";
import { quotes } from "../../data/adminData";

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

function NavItem({ to, end, icon: Icon, label, badge }) {
  return (
    <NavLink
      key={label}
      to={to}
      end={end}
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

  const logout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* SIDEBAR */}
      <aside className="w-64 bg-navy-dark text-white flex flex-col shrink-0 sticky top-0 h-screen px-3 py-6">
        <div className="flex items-center gap-2.5 px-2.5 pb-6 border-b border-white/10">
          <img src={logo} alt="MN3J-GROUP" className="h-9 w-9 object-cover object-top rounded-md bg-white" />
          <div>
            <div className="font-display font-bold text-sm leading-tight">
              MN3J<span className="text-green">-</span>GROUP
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">Espace administration</div>
          </div>
        </div>

        <div className="text-[10.5px] font-semibold tracking-[0.12em] text-white/40 px-3 pt-5 pb-2">PILOTAGE</div>
        <nav className="flex flex-col gap-1">
          <NavItem {...navMain[0]} />
          <NavItem {...navMain[1]} badge={String(projects.length)} />
          <NavItem {...navMain[2]} badge={newQuotes ? String(newQuotes) : null} />
          <NavItem {...navMain[3]} />
          <NavItem {...navMain[4]} />
        </nav>

        <div className="text-[10.5px] font-semibold tracking-[0.12em] text-white/40 px-3 pt-6 pb-2">CONTENU DU SITE</div>
        <nav className="flex flex-col gap-1">
          {navContent.map((item) => (
            <NavItem key={item.label} {...item} />
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
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-black/5 px-8 py-4">
          <div className="text-[12.5px] text-muted">{subtitle}</div>
          <h1 className="text-navy font-display font-bold text-xl mt-0.5">{title}</h1>
        </header>

        <div className="p-8 space-y-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
