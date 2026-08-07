import { Waves, Sparkles, HardHat, GraduationCap, Droplets } from "lucide-react";

import piscinesImg from "../assets/images/piscine-debordement.jpg";
import decorationImg from "../assets/images/decoration-terrasse.jpg";
import btpImg from "../assets/images/btp-chantier.jpg";
import formationImg from "../assets/images/formation-natation.jpg";
import entretienImg from "../assets/images/entretien-eau.jpg";

import piscinesModernesImg from "../assets/images/sub-piscines-modernes.jpg";
import piscinesClassiquesImg from "../assets/images/sub-piscines-classiques.jpg";
import piscinesDebordementImg from "../assets/images/sub-piscines-debordement.jpg";
import piscinesDebordementMiroirImg from "../assets/images/sub-piscines-debordement-miroir.jpg";
import piscinesVipImg from "../assets/images/sub-piscines-vip.jpg";
import piscinesBioImg from "../assets/images/sub-piscines-bio.jpg";

import decorationPaysagerImg from "../assets/images/sub-decoration-paysager.jpg";
import decorationInterieureImg from "../assets/images/sub-decoration-interieure.jpg";
import decorationExterieureImg from "../assets/images/sub-decoration-exterieure.jpg";
import decorationMobilierImg from "../assets/images/sub-decoration-mobilier.jpg";

import btpBatimentsImg from "../assets/images/sub-btp-batiments.jpg";
import btpEdificesImg from "../assets/images/sub-btp-edifices.jpg";
import btpComplexesSportifsImg from "../assets/images/sub-btp-complexes-sportifs.jpg";
import projetResidenceImg from "../assets/images/projet-residence-bel-horizon.jpg";

import formationMnsImg from "../assets/images/sub-formation-mns.jpg";
import formationFormateursImg from "../assets/images/sub-formation-formateurs.jpg";
import projetCentreImg from "../assets/images/projet-centre-nautique-azur.jpg";
import formationRecyclageImg from "../assets/images/sub-formation-recyclage.jpg";

// Ordre volontaire : Piscines · Décoration · BTP · Formation
// (reflète l'ordre affiché dans le hero, la navigation et la page d'accueil)
// Les textes (title, description, subItems...) vivent dans src/i18n/{fr,en}.js ;
// ce fichier ne porte que la structure (id, icône, images).
export const services = [
  {
    id: "piscines",
    number: "01",
    icon: Waves,
    image: piscinesImg,
    subImages: {
      modernes: piscinesModernesImg,
      classiques: piscinesClassiquesImg,
      debordement: piscinesDebordementImg,
      "debordement-miroir": piscinesDebordementMiroirImg,
      vip: piscinesVipImg,
      bio: piscinesBioImg,
    },
  },
  {
    id: "decoration",
    number: "02",
    icon: Sparkles,
    image: decorationImg,
    subImages: {
      paysager: decorationPaysagerImg,
      interieure: decorationInterieureImg,
      exterieure: decorationExterieureImg,
      mobilier: decorationMobilierImg,
    },
  },
  {
    id: "btp",
    number: "03",
    icon: HardHat,
    image: btpImg,
    subImages: {
      batiments: btpBatimentsImg,
      edifices: btpEdificesImg,
      "complexes-sportifs": btpComplexesSportifsImg,
      "gros-oeuvre": projetResidenceImg,
    },
  },
  {
    id: "formation",
    number: "04",
    icon: GraduationCap,
    image: formationImg,
    subImages: {
      mns: formationMnsImg,
      formateurs: formationFormateursImg,
      perfectionnement: projetCentreImg,
      recyclage: formationRecyclageImg,
    },
  },
];

// Rubrique complémentaire (entretien) : reliée depuis le pôle Piscines,
// hors de la grille "Quatre expertises" de la page d'accueil.
export const maintenanceService = {
  id: "entretien",
  icon: Droplets,
  image: entretienImg,
};
