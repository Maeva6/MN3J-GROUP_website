import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Lock } from "lucide-react";
import logo from "../../assets/images/logo.jpeg";
import { isAdminAuthenticated, loginAdmin } from "../../utils/adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const submit = (e) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      const redirectTo = location.state?.from || "/admin";
      navigate(redirectTo, { replace: true });
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <form onSubmit={submit} className="bg-white border border-black/5 rounded-lg shadow-card w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={logo} alt="MN3J-GROUP" className="h-12 w-12 object-cover object-top rounded mb-3" />
          <h1 className="text-navy font-display font-semibold text-lg">Espace Admin</h1>
          <p className="text-muted text-xs mt-1">Accès réservé à l'équipe MN3J-GROUP</p>
        </div>

        <label className="text-xs font-semibold text-muted">Mot de passe</label>
        <div className="relative mt-1">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-md ${error ? "border-red-400" : "border-black/10"}`}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-2">Mot de passe incorrect.</p>}

        <button
          type="submit"
          className="w-full mt-5 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-navy-dark transition-colors"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
