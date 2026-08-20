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
import decorationFauxPlafondImg from "../assets/images/sub-decoration-faux-plafond.jpg";
import decorationVitrerieImg from "../assets/images/sub-decoration-vitrerie.jpg";
import decorationAluminiumImg from "../assets/images/sub-decoration-aluminium.jpg";
import decorationMenuiserieBoisImg from "../assets/images/sub-decoration-menuiserie-bois.jpg";
import decorationPeintureImg from "../assets/images/sub-decoration-peinture.jpg";
import decorationElectriciteImg from "../assets/images/sub-decoration-electricite.jpg";

import btpBatimentsImg from "../assets/images/sub-btp-batiments.jpg";
import btpEdificesImg from "../assets/images/sub-btp-edifices.jpg";
import btpComplexesSportifsImg from "../assets/images/sub-btp-complexes-sportifs.jpg";
import projetResidenceImg from "../assets/images/projet-residence-bel-horizon.jpg";

import formationMnsImg from "../assets/images/sub-formation-mns.jpg";
import formationFormateursImg from "../assets/images/sub-formation-formateurs.jpg";
import formationInitiationImg from "../assets/images/sub-formation-initiation.jpg";
import formationReeducationImg from "../assets/images/sub-formation-reeducation.jpg";
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
    // Sous-type mis en avant sur la page d'accueil
    featuredSub: "debordement-miroir",
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
    featuredSub: "exterieure",
    subImages: {
      paysager: decorationPaysagerImg,
      interieure: decorationInterieureImg,
      exterieure: decorationExterieureImg,
      mobilier: decorationMobilierImg,
      // ⚠️ Pas encore de photo de chantier MN3J-GROUP pour ces 6 déclinaisons :
      // photos libres de droits (licence Pexels, usage commercial libre, sans
      // attribution requise) le temps d'avoir de vraies photos de chantier.
      // Choisies pour montrer un rendu FINI (pas un ouvrier en plein travaux) :
      // pour "faux-plafond" et "electricite", dont le titre liste plusieurs
      // éléments entre parenthèses, la photo réunit plusieurs de ces éléments
      // dans une même pièce finie (ex. plafond suspendu + spots encastrés pour
      // "faux-plafond" ; suspensions pour "electricite") plutôt qu'un seul
      // élément isolé.
      "faux-plafond": decorationFauxPlafondImg,
      vitrerie: decorationVitrerieImg,
      aluminium: decorationAluminiumImg,
      "menuiserie-bois": decorationMenuiserieBoisImg,
      peinture: decorationPeintureImg,
      electricite: decorationElectriciteImg,
    },
    // Recadrage : par défaut PhotoFrame centre la photo, ce qui convient aux 4
    // déclinaisons déjà en place. Pour 3 des nouvelles photos (portrait, sujet
    // proche du haut du cadre), un recadrage centré coupait l'élément
    // important une fois compressé dans une carte large et basse (desktop) :
    // on les ancre donc en haut. Ne pas étendre à toutes les clés — paysager
    // et interieure perdaient leur sujet (maison, mobilier) une fois ancrées
    // en haut, elles restent donc au centrage par défaut.
    subImageFocus: {
      "faux-plafond": "top",
      vitrerie: "top",
      electricite: "top",
    },
  },
  {
    id: "btp",
    number: "03",
    icon: HardHat,
    image: btpImg,
    featuredSub: "batiments",
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
    // Pôle piloté par ASCII, la marque formation du groupe MN3J-GROUP :
    // affiché en badge sur les pages qui listent ce pôle (nav, chantiers, fiche pôle).
    brand: "ASCII",
    featuredSub: "mns",
    subImages: {
      mns: formationMnsImg,
      formateurs: formationFormateursImg,
      // Idem "decoration" ci-dessus : photo libre de droits (licence Pexels)
      // en attendant une vraie photo de chantier ASCII.
      initiation: formationInitiationImg,
      reeducation: formationReeducationImg,
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
