
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
