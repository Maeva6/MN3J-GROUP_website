// Verrou d'accès simple pour /admin.
// ⚠️ Le site n'a pas de serveur : ce mot de passe est comparé côté navigateur
// et reste techniquement visible dans le bundle JS. Il bloque les visiteurs
// non autorisés mais ne remplace pas une vraie authentification back-end
// (à mettre en place avant un usage sensible en production).

const STORAGE_KEY = "mn3j_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 heures
// Pas de valeur par défaut en dur : un mot de passe codé ici finirait de
// toute façon dans le bundle JS envoyé au navigateur (voir avertissement
// ci-dessus), donc autant ne pas en publier un devinable. Sans
// VITE_ADMIN_PASSWORD défini, la connexion est refusée pour tout le monde.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

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
