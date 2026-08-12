// Structure des témoignages (id, auteur, pôle, note) — le texte de la
// citation vit dans src/i18n/{fr,en}.js sous data.testimonials.<id>.quote,
// comme pour les chantiers (src/data/projects.js).
// ⚠️ Contenu de démonstration — à remplacer par de vrais retours clients.

export const testimonials = [
  { id: "t1", name: "Jean-Marc A.", role: "Propriétaire — Villa à Bonapriso", poleId: "piscines", rating: 5 },
  { id: "t2", name: "Sylvie K.", role: "Directrice — Sté Horizon SA", poleId: "btp", rating: 5 },
  { id: "t3", name: "Paul N.", role: "Responsable technique — Complexe sportif", poleId: "formation", rating: 5 },
  { id: "t4", name: "Amélie T.", role: "Particulière — Riviera", poleId: "decoration", rating: 4 },
];
