// Client HTTP pour l'authentification admin, branchée sur le vrai back-end
// (server/), désormais connecté au frontend pour cette seule fonctionnalité.
// Le reste du back-office (chantiers, devis, clients affichés) continue
// d'utiliser les données de démonstration de src/data/*.js — seule
// l'authentification passe par l'API.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function adminLogin(email, password) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Impossible de joindre le serveur. Réessayez plus tard.");
  }

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(data.error || "Connexion impossible.");
  return data; // { token, admin: { id, email, name } }
}

export async function fetchAdminMe(token) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Impossible de joindre le serveur.");
  }

  if (!res.ok) throw new Error("Session invalide ou expirée.");
  return res.json();
}
