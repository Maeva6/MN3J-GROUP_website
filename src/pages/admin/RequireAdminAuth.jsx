import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken, logoutAdmin } from "../../utils/adminAuth";
import { fetchAdminMe } from "../../lib/adminApi";

// "checking" tant que le token stocké n'a pas été revérifié auprès du
// serveur (GET /api/auth/me) : un token présent en local peut avoir expiré
// ou été révoqué entre-temps, seul le serveur fait foi.
export default function RequireAdminAuth() {
  const location = useLocation();
  const token = getAdminToken();
  const [status, setStatus] = useState(token ? "checking" : "unauthenticated");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetchAdminMe(token)
      .then(() => {
        if (!cancelled) setStatus("authenticated");
      })
      .catch(() => {
        if (!cancelled) {
          logoutAdmin();
          setStatus("unauthenticated");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-9 h-9 rounded-full border-[3px] border-navy/15 border-t-navy animate-spin" />
      </div>
    );
  }

  return <Outlet />;
}
