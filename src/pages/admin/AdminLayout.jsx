import { NavLink, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, HardHat, FileText, Users, Settings, LogOut, ExternalLink } from "lucide-react";
import logo from "../../assets/images/logo.jpeg";
import { logoutAdmin } from "../../utils/adminAuth";

const nav = [
  { to: "/admin", end: true, icon: LayoutGrid, label: "Dashboard" },
  { to: "/admin/chantiers", icon: HardHat, label: "Chantiers" },
  { to: "/admin/devis", icon: FileText, label: "Devis" },
  { to: "/admin/clients", icon: Users, label: "Clients" },
  { to: "/admin/parametres", icon: Settings, label: "Paramètres" },
];

const titles = {
  "/admin": "Tableau de bord",
  "/admin/chantiers": "Gestion des chantiers",
  "/admin/devis": "Demandes de devis",
  "/admin/clients": "Clients",
  "/admin/parametres": "Paramètres",
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const title = titles[normalizedPath] || "Espace Admin";

  const logout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* SIDEBAR */}
      <aside className="w-64 bg-navy-dark text-white flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-6 h-20 border-b border-white/10">
          <img src={logo} alt="MN3J-GROUP" className="h-8 w-8 object-cover object-top rounded" />
          <span className="font-display font-bold text-sm">MN3J-GROUP</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {nav.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white font-semibold" : "text-white/70 hover:bg-white/5"
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-white/70 hover:bg-white/5 transition-colors"
          >
            <ExternalLink size={16} /> Retour au site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-white/70 hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-8">
          <h1 className="text-navy font-display font-semibold text-lg">{title}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-8 h-8 rounded-full bg-green text-[#12310F] font-semibold flex items-center justify-center text-xs">
              MN
            </span>
            <span className="text-muted">Admin MN3J</span>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
