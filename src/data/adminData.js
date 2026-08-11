// Données de démonstration pour l'espace admin (devis, clients).
// ⚠️ Ces données sont fictives et gérées uniquement en mémoire côté front-end —
// à remplacer par de vraies requêtes API dès qu'un back-end sera branché
// (voir le TODO dans src/pages/Contact.jsx pour le formulaire correspondant).

export const quotes = [
  {
    id: "q1",
    name: "Jean Mballa",
    email: "jean.mballa@example.com",
    phone: "+237 6 90 12 34 56",
    projectType: "Piscine haut de gamme",
    budget: "10 000 000 – 25 000 000 FCFA",
    message: "Je souhaite une piscine à débordement pour ma résidence à Bonapriso, avec éclairage LED.",
    status: "Nouveau",
    date: "2026-08-05",
  },
  {
    id: "q2",
    name: "Amina Njoya",
    email: "amina.njoya@example.com",
    phone: "+237 6 77 45 21 09",
    projectType: "Décoration",
    budget: "2 000 000 – 5 000 000 FCFA",
    message: "Aménagement paysager d'un jardin extérieur, environ 300 m².",
    status: "Contacté",
    date: "2026-08-02",
  },
  {
    id: "q3",
    name: "Sté Horizon SA",
    email: "contact@horizon.ci",
    phone: "+225 07 00 00 00 01",
    projectType: "BTP",
    budget: "Plus de 25 000 000 FCFA",
    message: "Extension du chantier Résidence Bel Horizon — nouveau bloc de 6 logements.",
    status: "Accepté",
    date: "2026-07-24",
  },
  {
    id: "q4",
    name: "Paul Etoundi",
    email: "paul.etoundi@example.com",
    phone: "+237 6 55 32 18 40",
    projectType: "Formation aquatique",
    budget: "Moins de 2 000 000 FCFA",
    message: "Formation maître-nageur-sauveteur pour 3 employés d'un hôtel à Kribi.",
    status: "Nouveau",
    date: "2026-08-09",
  },
  {
    id: "q5",
    name: "Fatou Diallo",
    email: "fatou.diallo@example.com",
    phone: "+237 6 91 22 33 44",
    projectType: "Piscine haut de gamme",
    budget: "5 000 000 – 10 000 000 FCFA",
    message: "Rénovation d'une piscine existante — étanchéité et nouveau revêtement.",
    status: "Refusé",
    date: "2026-07-15",
  },
];

export const quoteStatuses = ["Nouveau", "Contacté", "Accepté", "Refusé"];

export const quoteStatusStyles = {
  "Nouveau": "bg-[#E4EAF5] text-blue",
  "Contacté": "bg-[#FDE9C8] text-[#A8650F]",
  "Accepté": "bg-[#E7F3DA] text-green-dark",
  "Refusé": "bg-[#FBE1E1] text-[#B3261E]",
};

export const clients = [
  {
    id: "c1",
    name: "Sté Horizon SA",
    email: "contact@horizon.ci",
    phone: "+225 07 00 00 00 01",
    projectsCount: 1,
    totalValue: "45 000 000 FCFA",
  },
  {
    id: "c2",
    name: "Particulier — Cocody",
    email: "villa.palmiers@example.com",
    phone: "+225 07 11 22 33",
    projectsCount: 1,
    totalValue: "18 500 000 FCFA",
  },
  {
    id: "c3",
    name: "Ville de Grand-Bassam",
    email: "services.techniques@grand-bassam.ci",
    phone: "+225 21 30 10 10",
    projectsCount: 1,
    totalValue: "32 000 000 FCFA",
  },
  {
    id: "c4",
    name: "Particulier — Riviera",
    email: "villa.bahia@example.com",
    phone: "+225 07 44 55 66",
    projectsCount: 1,
    totalValue: "9 800 000 FCFA",
  },
];
