// Google Analytics 4 (gtag.js), chargé uniquement si VITE_GA_MEASUREMENT_ID
// est renseigné (voir .env.example). Tant que la variable est vide, aucun
// script tiers n'est chargé et aucune donnée de navigation n'est envoyée —
// sûr par défaut, à activer en fournissant votre propre ID de mesure GA4
// (format "G-XXXXXXXXXX", créé depuis votre compte Google Analytics).
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

export function initAnalytics() {
  if (!GA_ID || initialized) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // send_page_view désactivé : les pageviews sont envoyées manuellement à
  // chaque changement de route (SPA), voir trackPageview() dans App.jsx.
  window.gtag("config", GA_ID, { send_page_view: false });
}

export function trackPageview(path) {
  if (!GA_ID || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", { page_path: path });
}
