// Verrou d'accès simple pour /admin.
// ⚠️ Le site n'a pas de serveur : ce mot de passe est comparé côté navigateur
// et reste techniquement visible dans le bundle JS. Il bloque les visiteurs
// non autorisés mais ne remplace pas une vraie authentification back-end
// (à mettre en place avant un usage sensible en production).

const STORAGE_KEY = "mn3j_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 heures
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "mn3j-admin-2026";

export function isAdminAuthenticated() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const { expiresAt } = JSON.parse(raw);
    if (!expiresAt || Date.now() > expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

export function loginAdmin(password) {
  if (password !== ADMIN_PASSWORD) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ expiresAt: Date.now() + SESSION_DURATION_MS }));
  return true;
}

export function logoutAdmin() {
  localStorage.removeItem(STORAGE_KEY);
}
