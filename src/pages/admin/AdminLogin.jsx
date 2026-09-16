import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import logo from "../../assets/images/logo.jpeg";
import { isAdminAuthenticated, saveAdminSession } from "../../utils/adminAuth";
import { adminLogin } from "../../lib/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, admin } = await adminLogin(email, password);
      saveAdminSession({ token, admin });
      const redirectTo = location.state?.from || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Connexion impossible.");
    } finally {
      setLoading(false);
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

        <label className="text-xs font-semibold text-muted">Email</label>
        <div className="relative mt-1 mb-4">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="email"
            autoFocus
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-md ${error ? "border-red-400" : "border-black/10"}`}
          />
        </div>

        <label className="text-xs font-semibold text-muted">Mot de passe</label>
        <div className="relative mt-1">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-md ${error ? "border-red-400" : "border-black/10"}`}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
