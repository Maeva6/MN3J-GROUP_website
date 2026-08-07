export const projects = [
  {
    id: "villa-les-palmiers",
    name: "Villa Les Palmiers",
    category: "Piscine à débordement miroir",
    location: "Cocody",
    status: "Réalisé",
    progress: 100,
    year: "2024",
    duration: "4 mois",
    client: "Particulier — Cocody",
    image: "villa",
    description:
      "Conception et réalisation d'une piscine à débordement miroir avec plage en pierre naturelle et éclairage LED sur-mesure.",
  },
  {
    id: "residence-bel-horizon",
    name: "Résidence Bel Horizon",
    category: "BTP & finitions",
    location: "Assinie",
    status: "En cours",
    progress: 65,
    year: "2025",
    duration: "8 mois",
    client: "Sté Horizon SA",
    image: "residence",
    description:
      "Gros œuvre et finitions haut de gamme pour un ensemble résidentiel en bord de lagune, avec suivi hebdomadaire de l'avancement.",
  },
  {
    id: "centre-nautique-azur",
    name: "Centre nautique Azur",
    category: "Formation aquatique",
    location: "Grand-Bassam",
    status: "Réalisé",
    progress: 100,
    year: "2023",
    duration: "6 mois",
    client: "Ville de Grand-Bassam",
    image: "centre",
    description:
      "Mise en place d'un centre de formation de maîtres-nageurs-sauveteurs et de nageurs professionnels, bassin olympique inclus.",
  },
  {
    id: "villa-bahia",
    name: "Villa Bahia",
    category: "Décoration intérieure & extérieure",
    location: "Riviera",
    status: "Planifié",
    progress: 10,
    year: "2025",
    duration: "3 mois",
    client: "Particulier — Riviera",
    image: "bahia",
    description:
      "Aménagement paysager complet et décoration intérieure d'une villa contemporaine, en phase de conception.",
  },
];

export const stats = [
  { value: "150+", label: "Chantiers réalisés" },
  { value: "12", label: "Ans d'expérience" },
  { value: "300+", label: "Nageurs formés" },
  { value: "98%", label: "Clients satisfaits" },
];

export const statusStyles = {
  "Réalisé": "bg-[#E7F3DA] text-green-dark",
  "En cours": "bg-[#FDE9C8] text-[#A8650F]",
  "Planifié": "bg-[#E4EAF5] text-blue",
};
