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
    message: "Extension du chantier Résidence Bel Horizon, nouveau bloc de 6 logements.",
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
    message: "Rénovation d'une piscine existante, étanchéité et nouveau revêtement.",
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

// Équipe interne (initiales utilisées sur les cartes chantier / avatars) —
// données de démonstration, comme le reste de ce fichier.
export const teamMembers = {
  MN: { name: "Moussa N'Guessan", role: "Directeur général", bg: "bg-navy" },
  AK: { name: "Awa Koffi", role: "Responsable formation", bg: "bg-blue" },
  JD: { name: "Jean-Marc Diaby", role: "Chef de chantier BTP", bg: "bg-teal" },
  FT: { name: "Fatou Traoré", role: "Responsable décoration", bg: "bg-green-dark" },
};

// Libellés affichés par pôle (répartition du CA sur le tableau de bord) et
// couleur associée — distincte de progressBarClass (qui lit la progression,
// pas le pôle).
export const poleLabels = {
  piscines: { label: "Piscines haut de gamme", color: "#1B3A63" },
  btp: { label: "BTP & finitions", color: "#2B5AA0" },
  decoration: { label: "Décoration", color: "#7DBF3F" },
  formation: { label: "Formation aquatique", color: "#1C8C82" },
  ingenierie: { label: "Ingénierie & automatisation", color: "#3F6690" },
};

// Compléments par chantier (budget, équipe, échéance affichée) absents de
// src/data/projects.js — données de démonstration, à affiner une fois les
// vrais montants et équipes connus pour chaque chantier.
export const projectExtras = {
  "piscine-moderne-total-nkolbong": { budget: 28, team: ["MN", "AK"], dueLabel: "Livré" },
  "piscines-vip-spas-logbessou": { budget: 45, team: ["AK", "JD"], dueLabel: "Livré" },
  "piscine-miroir-etoa-meti": { budget: 60, team: ["MN"], dueLabel: "Livré" },
  "piscine-miroir-yassa-ari": { budget: 52, team: ["MN", "JD"], dueLabel: "30 nov." },
  "piscine-debordement-spas-limbe": { budget: 38, team: ["AK", "FT"], dueLabel: "15 janv." },
  "decoration-limbe": { budget: 14, team: ["FT"], dueLabel: "20 mars" },
  "ecole-natation-bonapriso": { budget: 6, team: ["AK"], dueLabel: "Livré" },
  "recyclage-mns-akwa": { budget: 4.5, team: ["AK", "JD"], dueLabel: "15 nov." },
  "centre-nautique-ucac-icam": { budget: 70, team: ["AK", "MN"], dueLabel: "Livré" },
  "centre-nautique-soft-education": { budget: 55, team: ["AK"], dueLabel: "Livré" },
};

// Étapes-type d'un chantier et seuil de progression à partir duquel chacune
// est considérée acquise — utilisé par le panneau latéral "Suivi" (Chantiers).
export const projectSteps = [
  ["Études & conception", 10],
  ["Gros œuvre", 35],
  ["Second œuvre", 65],
  ["Finitions", 90],
  ["Réception des travaux", 100],
];

// Chiffre d'affaires mensuel (12 derniers mois) — série de démonstration pour
// le graphique du tableau de bord, indépendante des budgets par chantier
// ci-dessus (comme pour le reste de ce fichier : à remplacer par de vraies
// données une fois le back-end branché).
export const monthlyRevenue = {
  months: ["Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct"],
  current: [18, 22, 19, 27, 31, 28, 36, 41, 38, 45, 52, 58],
  previous: [14, 16, 15, 20, 22, 21, 26, 29, 27, 31, 35, 39],
};

// Événements du planning — exprimés en jours relatifs à aujourd'hui (et non
// en dates figées) pour ne pas devenir obsolètes au fil du temps. `type` doit
// correspondre à une clé de `eventTypeColors` ci-dessous.
export const calendarEvents = [
  { offsetDays: -9, time: "09:00", title: "Réunion de chantier", place: "Piscine à débordement miroir — Yassa-Réserve-Market", type: "BTP" },
  { offsetDays: -2, time: "15:00", title: "Point équipe hebdomadaire", place: "Siège, Douala", type: "Interne" },
  { offsetDays: 0, time: "10:30", title: "Visite client", place: "Piscine à débordement avec spas — Nguemè, Limbé", type: "Piscines" },
  { offsetDays: 2, time: "08:00", title: "Session MNS — module 3", place: "Centre nautique UCAC-ICAM", type: "Formation" },
  { offsetDays: 5, time: "07:30", title: "Pose du carrelage du bassin", place: "Piscine à débordement miroir — Etoa-Meti", type: "Piscines" },
  { offsetDays: 5, time: "15:00", title: "Point équipe hebdomadaire", place: "Siège, Douala", type: "Interne" },
  { offsetDays: 8, time: "11:00", title: "Rendez-vous devis", place: "Jean Mballa", type: "Piscines" },
  { offsetDays: 13, time: "09:00", title: "Livraison mobilier extérieur", place: "Décoration — Nguemè, Limbé", type: "Décoration" },
  { offsetDays: 20, time: "08:30", title: "Examen final MNS", place: "Recyclage MNS, Complexe Akwa", type: "Formation" },
  { offsetDays: 23, time: "14:00", title: "Visite de fin de chantier", place: "Piscines VIP avec spas — Logbessou", type: "BTP" },
];

export const eventTypeColors = {
  BTP: { bg: "#eef1f4", text: "#3a4550", bar: "#5c6773" },
  Piscines: { bg: "#e6eef8", text: "#1B3A63", bar: "#2B5AA0" },
  Formation: { bg: "#e3f1f8", text: "#1f6f8b", bar: "#1C8C82" },
  "Décoration": { bg: "#e7f3da", text: "#4c8420", bar: "#7DBF3F" },
  Interne: { bg: "#fdf1dc", text: "#a8650f", bar: "#E6A23C" },
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
    name: "Particulier, Cocody",
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
    name: "Particulier, Riviera",
    email: "villa.bahia@example.com",
    phone: "+225 07 44 55 66",
    projectsCount: 1,
    totalValue: "9 800 000 FCFA",
  },
];
