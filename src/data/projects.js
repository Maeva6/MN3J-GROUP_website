
// Photos "avant" par pôle (chantier / pièce avant intervention MN3J-GROUP),
// utilisées avec la photo "après" existante de chaque chantier (`image`) dans
// le slider avant/après de la fiche chantier. Photos libres de droits
// (licence Pexels, usage commercial libre) en attendant de vraies photos
// "avant" prises sur nos chantiers. Formation réutilise la photo piscine :
// un bassin de formation se construit comme un bassin classique.
import piscinesModernesImg from "../assets/images/sub-piscines-modernes.jpg";
import piscinesSpasImg from "../assets/images/sub-piscines-spas.jpg";
import piscinesDebordementMiroirImg from "../assets/images/sub-piscines-debordement-miroir.jpg";
import piscinesDebordementImg from "../assets/images/sub-piscines-debordement.jpg";
import decorationInterieureImg from "../assets/images/sub-decoration-interieure.jpg";
import ecoleNatationImg from "../assets/images/projet-ecole-natation-bonapriso.jpg";
import recyclageMnsImg from "../assets/images/projet-recyclage-mns-akwa.jpg";
import centreImg from "../assets/images/projet-centre-nautique-azur.jpg";
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
    id: "piscine-moderne-total-nkolbong",
    name: "Piscine moderne – Total Nkolbong, Douala",
    poleId: "piscines",
    category: "Piscine moderne",
    location: "Total Nkolbong (Cité Chirac), Douala",
    status: "Réalisé",
    progress: 100,
    year: "À préciser",
    duration: "À préciser",
    client: "À préciser",
    image: piscinesModernesImg,
    description:
      "Réalisation d'une piscine moderne à Total Nkolbong (Cité Chirac), Douala.",
  },
  {
    id: "piscines-vip-spas-logbessou",
    name: "Piscines VIP avec spas – Logbessou, Douala",
    poleId: "piscines",
    category: "Piscines VIP avec spas",
    location: "Logbessou, Douala",
    status: "Réalisé",
    progress: 100,
    year: "À préciser",
    duration: "À préciser",
    client: "À préciser",
    image: piscinesSpasImg,
    description:
      "Piscines VIP avec spas, réalisées à Logbessou, Douala.",
  },
  {
    id: "piscine-miroir-etoa-meti",
    name: "Piscine à débordement miroir – Etoa-Meti, Yaoundé",
    poleId: "piscines",
    category: "Piscine à débordement miroir",
    location: "Etoa-Meti, Yaoundé",
    status: "Réalisé",
    progress: 100,
    year: "À préciser",
    duration: "À préciser",
    client: "À préciser",
    image: piscinesDebordementMiroirImg,
    description:
      "Piscine à débordement miroir réalisée à Etoa-Meti, Yaoundé.",
  },
  {
    id: "piscine-miroir-yassa-ari",
    name: "Piscine à débordement miroir – Yassa-Réserve-Market, Douala",
    poleId: "piscines",
    category: "Piscine à débordement miroir",
    location: "Yassa-Réserve-Market (Ari), Douala",
    status: "En cours",
    progress: 80,
    year: "À préciser",
    duration: "À préciser",
    client: "À préciser",
    image: piscinesDebordementMiroirImg,
    description:
      "Piscine à débordement miroir en cours de réalisation à Yassa-Réserve-Market (Ari), Douala.",
  },
  {
    id: "piscine-debordement-spas-limbe",
    name: "Piscine à débordement avec spas – Nguemè, Limbé",
    poleId: "piscines",
    category: "Piscine à débordement avec spas",
    location: "Nguemè, Limbé",
    status: "En cours",
    progress: 50,
    year: "À préciser",
    duration: "À préciser",
    client: "À préciser",
    image: piscinesDebordementImg,
    description:
      "Piscine à débordement avec spas en cours de réalisation à Nguemè, Limbé.",
  },
  {
    id: "decoration-limbe",
    name: "Décoration intérieure et extérieure – Nguemè, Limbé",
    poleId: "decoration",
    category: "Décoration intérieure & extérieure",
    location: "Nguemè, Limbé",
    status: "En cours",
    progress: 5,
    year: "À préciser",
    duration: "À préciser",
    client: "À préciser",
    image: decorationInterieureImg,
    description:
      "Décoration intérieure et extérieure en cours de réalisation à Nguemè, Limbé.",
  },
  {
    id: "ecole-natation-bonapriso",
    name: "École de natation de Bonapriso",
    poleId: "formation",
    category: "Formation aquatique",
    location: "Bonapriso, Douala",
    status: "Réalisé",
    progress: 100,
    year: "2024",
    duration: "3 mois",
    client: "École primaire, Bonapriso",
    image: ecoleNatationImg,
    description:
      "Programme d'initiation et d'apprentissage de la natation pour les élèves d'une école primaire, encadré par ASCY.",
  },
  {
    id: "recyclage-mns-akwa",
    name: "Recyclage MNS, Complexe Akwa",
    poleId: "formation",
    category: "Formation aquatique",
    location: "Akwa, Douala",
    status: "En cours",
    progress: 70,
    year: "2025",
    duration: "2 mois",
    client: "Complexe sportif, Akwa",
    image: recyclageMnsImg,
    description:
      "Session de recyclage et de mise à niveau pour les maîtres-nageurs-sauveteurs en poste, pilotée par ASCY.",
  },
  {
    id: "centre-nautique-ucac-icam",
    name: "Centre nautique UCAC-ICAM",
    poleId: "formation",
    category: "Formation aquatique",
    location: "Yassa, Douala",
    status: "Réalisé",
    progress: 100,
    year: "À préciser",
    duration: "À préciser",
    client: "UCAC-ICAM",
    image: centreImg,
    description:
      "Centre nautique de formation aquatique de l'UCAC-ICAM, à Yassa, Douala.",
  },
  {
    id: "centre-nautique-soft-education",
    name: "Centre nautique Soft Education",
    poleId: "formation",
    category: "Formation aquatique",
    location: "Total Nkolbong, Douala",
    status: "Réalisé",
    progress: 100,
    year: "À préciser",
    duration: "À préciser",
    client: "Soft Education",
    image: centreImg,
    description:
      "Centre nautique de formation aquatique de Soft Education, à Total Nkolbong, Douala.",
  },
];

export const stats = [
  { value: "150+", label: "Chantiers réalisés" },
  { value: "12", label: "Ans d'expérience" },
  { value: "300+", label: "Nageurs formés" },
  { value: "100%", label: "Clients satisfaits" },
];

// Couleur de la barre d'avancement selon le pourcentage :
// 100 % = vert (terminé), 61-99 % = bleu, 21-60 % = teal, 0-20 % = bleu ardoise.
export function progressBarClass(progress) {
  if (progress >= 100) return "bg-green";
  if (progress > 60) return "bg-blue";
  if (progress > 20) return "bg-teal";
  return "bg-navy-light";
}

export const statusStyles = {
  "Réalisé": "bg-[#E7F3DA] text-green-dark",
  "En cours": "bg-[#FDE9C8] text-[#A8650F]",
  "Planifié": "bg-[#E4EAF5] text-blue",
};
