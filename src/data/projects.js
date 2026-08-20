import villaImg from "../assets/images/projet-villa-les-palmiers.jpg";
import residenceImg from "../assets/images/projet-residence-bel-horizon.jpg";
import centreImg from "../assets/images/projet-centre-nautique-azur.jpg";
import bahiaImg from "../assets/images/projet-villa-bahia.jpg";
import ecoleNatationImg from "../assets/images/sub-formation-initiation.jpg";
import recyclageMnsImg from "../assets/images/sub-formation-recyclage.jpg";

// Photos "avant" par pôle (chantier / pièce avant intervention MN3J-GROUP),
// utilisées avec la photo "après" existante de chaque chantier (`image`) dans
// le slider avant/après de la fiche chantier. Photos libres de droits
// (licence Pexels, usage commercial libre) en attendant de vraies photos
// "avant" prises sur nos chantiers. Formation réutilise la photo piscine :
// un bassin de formation se construit comme un bassin classique.
import avantPiscinesImg from "../assets/images/avant-piscines.jpg";
import avantDecorationImg from "../assets/images/avant-decoration.jpg";
import avantBtpImg from "../assets/images/avant-btp.jpg";

export const beforeImages = {
  piscines: avantPiscinesImg,
  decoration: avantDecorationImg,
  btp: avantBtpImg,
  formation: avantPiscinesImg,
};

export const projects = [
  {
    id: "villa-les-palmiers",
    name: "Villa Les Palmiers",
    poleId: "piscines",
    category: "Piscine à débordement miroir",
    location: "Cocody",
    status: "Réalisé",
    progress: 100,
    year: "2024",
    duration: "4 mois",
    client: "Particulier — Cocody",
    image: villaImg,
    description:
      "Conception et réalisation d'une piscine à débordement miroir avec plage en pierre naturelle et éclairage LED sur-mesure.",
  },
  {
    id: "residence-bel-horizon",
    name: "Résidence Bel Horizon",
    poleId: "btp",
    category: "BTP & finitions",
    location: "Assinie",
    status: "En cours",
    progress: 65,
    year: "2025",
    duration: "8 mois",
    client: "Sté Horizon SA",
    image: residenceImg,
    description:
      "Gros œuvre et finitions haut de gamme pour un ensemble résidentiel en bord de lagune, avec suivi hebdomadaire de l'avancement.",
  },
  {
    id: "centre-nautique-azur",
    name: "Centre nautique Azur",
    poleId: "formation",
    category: "Formation aquatique",
    location: "Grand-Bassam",
    status: "Réalisé",
    progress: 100,
    year: "2023",
    duration: "6 mois",
    client: "Ville de Grand-Bassam",
    image: centreImg,
    description:
      "Mise en place d'un centre de formation de maîtres-nageurs-sauveteurs et de nageurs professionnels, bassin olympique inclus.",
  },
  {
    id: "villa-bahia",
    name: "Villa Bahia",
    poleId: "decoration",
    category: "Décoration intérieure & extérieure",
    location: "Riviera",
    status: "Planifié",
    progress: 10,
    year: "2025",
    duration: "3 mois",
    client: "Particulier — Riviera",
    image: bahiaImg,
    description:
      "Aménagement paysager complet et décoration intérieure d'une villa contemporaine, en phase de conception.",
  },
  // Chantiers formation, pilotés par ASCII (voir services.js → formation.brand).
  {
    id: "ecole-natation-bonapriso",
    name: "École de natation — Bonapriso",
    poleId: "formation",
    category: "Formation aquatique",
    location: "Bonapriso, Douala",
    status: "Réalisé",
    progress: 100,
    year: "2024",
    duration: "3 mois",
    client: "École primaire — Bonapriso",
    image: ecoleNatationImg,
    description:
      "Programme d'initiation et d'apprentissage de la natation pour les élèves d'une école primaire, encadré par ASCII.",
  },
  {
    id: "recyclage-mns-akwa",
    name: "Recyclage MNS — Complexe Akwa",
    poleId: "formation",
    category: "Formation aquatique",
    location: "Akwa, Douala",
    status: "En cours",
    progress: 70,
    year: "2025",
    duration: "2 mois",
    client: "Complexe sportif — Akwa",
    image: recyclageMnsImg,
    description:
      "Session de recyclage et de mise à niveau pour les maîtres-nageurs-sauveteurs en poste, pilotée par ASCII.",
  },
];

export const stats = [
  { value: "150+", label: "Chantiers réalisés" },
  { value: "12", label: "Ans d'expérience" },
  { value: "300+", label: "Nageurs formés" },
  { value: "100%", label: "Clients satisfaits" },
];

export const statusStyles = {
  "Réalisé": "bg-[#E7F3DA] text-green-dark",
  "En cours": "bg-[#FDE9C8] text-[#A8650F]",
  "Planifié": "bg-[#E4EAF5] text-blue",
};
