import { useEffect } from "react";

// Pas de dépendance externe (react-helmet…) : ce composant met à jour le
// <title> et les balises meta au montage de chaque page.
// ⚠️ Limite connue : le site est un SPA sans rendu serveur. Les moteurs qui
// exécutent le JavaScript (Google) verront ces balises, mais les robots de
// partage social (Facebook, WhatsApp, LinkedIn…) ne les exécutent pas — ils
// ne liront que les balises statiques posées une fois pour toutes dans
// index.html. Un vrai Open Graph par page nécessiterait du SSR/prerendering.

function setMeta(attr, key, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function Seo({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
  }, [title, description]);

  return null;
}
