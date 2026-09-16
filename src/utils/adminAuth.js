// Session admin : stocke le token JWT obtenu auprès de l'API (voir
// src/lib/adminApi.js). L'authentification elle-même est vérifiée côté
// serveur (mot de passe hashé, JWT signé) — ce module ne fait plus que lire/
// écrire la session en local, il ne décide jamais seul qu'un token est valide.

const STORAGE_KEY = "mn3j_admin_session";

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAdminToken() {
  return getAdminSession()?.token ?? null;
}

// Vérification optimiste et synchrone (pas d'appel réseau), utilisée pour un
// premier rendu instantané. RequireAdminAuth revérifie ensuite le token
// auprès du serveur (GET /api/auth/me) : un token présent mais expiré ou
// révoqué est détecté à ce moment-là, pas ici.
export function isAdminAuthenticated() {
  return !!getAdminToken();
}

export function saveAdminSession({ token, admin }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, admin }));
}

export function logoutAdmin() {
  localStorage.removeItem(STORAGE_KEY);
}
