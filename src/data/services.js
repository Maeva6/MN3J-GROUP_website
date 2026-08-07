import { Waves, Sparkles, HardHat, GraduationCap, Droplets } from "lucide-react";

// Ordre volontaire : Piscines · Décoration · BTP · Formation
// (reflète l'ordre affiché dans le hero, la navigation et la page d'accueil)
export const services = [
  {
    id: "piscines",
    number: "01",
    icon: Waves,
    image: "piscine",
    subItems: [
      { title: "Piscines modernes", description: "Lignes épurées, matériaux contemporains et intégration architecturale." },
      { title: "Piscines classiques", description: "Formes intemporelles et finitions traditionnelles haut de gamme." },
      { title: "Piscines à débordement", description: "Effet miroir sur un ou plusieurs côtés, pour une vue dégagée sans limite visuelle." },
      { title: "Piscines à débordement miroir", description: "Lame d'eau parfaite qui reflète le paysage, signature de nos réalisations d'exception." },
      { title: "Piscines VIP sur-mesure", description: "Bassins entièrement personnalisés pour résidences et complexes haut de gamme." },
      { title: "Piscines bio (naturelles)", description: "Filtration naturelle par lagunage, sans traitement chimique agressif." },
    ],
  },
  {
    id: "decoration",
    number: "02",
    icon: Sparkles,
    image: "decoration",
    subItems: [
      { title: "Aménagement paysager", description: "Jardins, espaces verts et abords extérieurs pensés pour sublimer le bâti." },
      { title: "Décoration intérieure", description: "Agencement, mobilier et finitions pour des intérieurs à la hauteur de vos exigences." },
      { title: "Décoration extérieure", description: "Terrasses, pergolas et espaces de vie extérieurs raffinés." },
      { title: "Mobilier & finitions sur-mesure", description: "Pièces uniques conçues et réalisées pour chaque projet." },
    ],
  },
  {
    id: "btp",
    number: "03",
    icon: HardHat,
    image: "btp",
    subItems: [
      { title: "Bâtiments résidentiels & tertiaires", description: "Construction de villas, immeubles et locaux professionnels." },
      { title: "Édifices institutionnels", description: "Ouvrages publics et institutionnels réalisés selon les normes en vigueur." },
      { title: "Complexes sportifs", description: "Infrastructures sportives intégrant nos expertises piscine et BTP." },
      { title: "Gros œuvre, second œuvre & finitions", description: "Un seul interlocuteur du terrassement à la dernière finition." },
    ],
  },
  {
    id: "formation",
    number: "04",
    icon: GraduationCap,
    image: "formation",
    subItems: [
      { title: "Maîtres-nageurs-sauveteurs (MNS)", description: "Formation diplômante à la surveillance et au sauvetage aquatique." },
      { title: "Formateurs certifiés", description: "Formation de formateurs habilités à transmettre les brevets d'État." },
      { title: "Perfectionnement de nageurs professionnels", description: "Encadrement technique pour nageurs de haut niveau." },
      { title: "Recyclage & mise à niveau des brevets", description: "Mise à jour réglementaire des qualifications existantes." },
    ],
  },
];

// Rubrique complémentaire (entretien) : affichée sur la page Services,
// hors de la grille "Quatre expertises" de la page d'accueil.
export const maintenanceService = {
  id: "entretien",
  icon: Droplets,
  subItems: [
    { title: "Traitement & équilibre de l'eau", description: "Contrôle du pH, désinfection et prévention des algues." },
    { title: "Nettoyage & filtration", description: "Entretien du bassin, des filtres et des équipements de circulation." },
    { title: "Contrôles saisonniers", description: "Mise en hivernage, remise en route et diagnostics périodiques." },
    { title: "Contrats d'entretien sur-mesure", description: "Formules adaptées aux résidences, hôtels et complexes sportifs." },
  ],
};
