// ⚠️ À COMPLÉTER : toutes les informations réelles de l'entreprise sont
// centralisées ici. Corrigez-les à cet unique endroit — elles se
// répercutent automatiquement sur le Footer, la page Contact, etc.

export const siteConfig = {
  companyName: "MN3J-GROUP Sarl",
  // Adresse complète réelle du siège
  address: {
    street: "PK8",
    city: "Douala-Ndokoti",
    country: "Cameroun",
  },
  phone: "+___ __ __ __ __ __",
  email: "contact@mn3j-group.com",
  hours: [
    { day: "Lundi – Vendredi", time: "8h00 – 18h00" },
    { day: "Samedi", time: "9h00 – 14h00" },
    { day: "Dimanche", time: "Fermé" },
  ],
  // Coordonnées GPS du siège, pour la carte de la page Contact
  map: { lat: null, lng: null },
  social: {
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
    tiktok: "https://tiktok.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
};
