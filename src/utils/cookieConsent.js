// Consentement cookies (RGPD / ePrivacy) : tant que l'utilisateur n'a pas
// explicitement accepté, aucun cookie non essentiel (Google Analytics) n'est
// déposé. Le choix est mémorisé en local, indépendamment de tout cookie.

const STORAGE_KEY = "mn3j_cookie_consent";

export function getCookieConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setCookieConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Stockage indisponible (navigation privée stricte, etc.) : le bandeau
    // se réaffichera à la prochaine visite, sans bloquer l'utilisateur.
  }
}
