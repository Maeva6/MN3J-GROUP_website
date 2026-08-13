import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Données reprises telles quelles de src/data/*.js et src/i18n/fr.js, pour
// que l'API renvoie exactement ce que le frontend affiche déjà en dur.
// ⚠️ Contenu de démonstration — à remplacer avant mise en production
// (voir le README racine, section "À compléter avant mise en ligne").

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@mn3jgroup.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me-before-deploy";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      name: "Admin MN3J",
    },
  });
  console.log(`✓ Compte admin prêt : ${adminEmail}`);

  const projects = [
    {
      slug: "villa-les-palmiers",
      name: "Villa Les Palmiers",
      poleId: "piscines",
      category: "Piscine à débordement miroir",
      location: "Cocody",
      status: "Réalisé",
      progress: 100,
      year: "2024",
      duration: "4 mois",
      client: "Particulier — Cocody",
      description:
        "Conception et réalisation d'une piscine haut de gamme à débordement miroir avec plage en pierre naturelle et éclairage LED sur-mesure.",
    },
    {
      slug: "residence-bel-horizon",
      name: "Résidence Bel Horizon",
      poleId: "btp",
      category: "BTP & finitions",
      location: "Assinie",
      status: "En cours",
      progress: 65,
      year: "2025",
      duration: "8 mois",
      client: "Sté Horizon SA",
      description:
        "Gros œuvre et finitions haut de gamme pour un ensemble résidentiel en bord de lagune, avec suivi hebdomadaire de l'avancement.",
    },
    {
      slug: "centre-nautique-azur",
      name: "Centre nautique Azur",
      poleId: "formation",
      category: "Formation aquatique",
      location: "Grand-Bassam",
      status: "Réalisé",
      progress: 100,
      year: "2023",
      duration: "6 mois",
      client: "Ville de Grand-Bassam",
      description:
        "Mise en place d'un centre de formation de maîtres-nageurs-sauveteurs et de nageurs professionnels, bassin olympique inclus.",
    },
    {
      slug: "villa-bahia",
      name: "Villa Bahia",
      poleId: "decoration",
      category: "Décoration intérieure & extérieure",
      location: "Riviera",
      status: "Planifié",
      progress: 10,
      year: "2025",
      duration: "3 mois",
      client: "Particulier — Riviera",
      description:
        "Aménagement paysager complet et décoration intérieure d'une villa contemporaine, en phase de conception.",
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({ where: { slug: project.slug }, update: project, create: project });
  }
  console.log(`✓ ${projects.length} chantiers`);

  const quotes = [
    {
      name: "Jean Mballa",
      email: "jean.mballa@example.com",
      phone: "+237 6 90 12 34 56",
      projectType: "Piscine haut de gamme",
      budget: "10 000 000 – 25 000 000 FCFA",
      message: "Je souhaite une piscine à débordement pour ma résidence à Bonapriso, avec éclairage LED.",
      status: "Nouveau",
    },
    {
      name: "Amina Njoya",
      email: "amina.njoya@example.com",
      phone: "+237 6 77 45 21 09",
      projectType: "Décoration",
      budget: "2 000 000 – 5 000 000 FCFA",
      message: "Aménagement paysager d'un jardin extérieur, environ 300 m².",
      status: "Contacté",
    },
    {
      name: "Sté Horizon SA",
      email: "contact@horizon.ci",
      phone: "+225 07 00 00 00 01",
      projectType: "BTP",
      budget: "Plus de 25 000 000 FCFA",
      message: "Extension du chantier Résidence Bel Horizon — nouveau bloc de 6 logements.",
      status: "Accepté",
    },
    {
      name: "Paul Etoundi",
      email: "paul.etoundi@example.com",
      phone: "+237 6 55 32 18 40",
      projectType: "Formation aquatique",
      budget: "Moins de 2 000 000 FCFA",
      message: "Formation maître-nageur-sauveteur pour 3 employés d'un hôtel à Kribi.",
      status: "Nouveau",
    },
    {
      name: "Fatou Diallo",
      email: "fatou.diallo@example.com",
      phone: "+237 6 91 22 33 44",
      projectType: "Piscine haut de gamme",
      budget: "5 000 000 – 10 000 000 FCFA",
      message: "Rénovation d'une piscine existante — étanchéité et nouveau revêtement.",
      status: "Refusé",
    },
  ];

  if ((await prisma.quote.count()) === 0) {
    await prisma.quote.createMany({ data: quotes });
  }
  console.log(`✓ ${quotes.length} demandes de devis`);

  const clients = [
    { name: "Sté Horizon SA", email: "contact@horizon.ci", phone: "+225 07 00 00 00 01", projectsCount: 1, totalValue: "45 000 000 FCFA" },
    { name: "Particulier — Cocody", email: "villa.palmiers@example.com", phone: "+225 07 11 22 33", projectsCount: 1, totalValue: "18 500 000 FCFA" },
    { name: "Ville de Grand-Bassam", email: "services.techniques@grand-bassam.ci", phone: "+225 21 30 10 10", projectsCount: 1, totalValue: "32 000 000 FCFA" },
    { name: "Particulier — Riviera", email: "villa.bahia@example.com", phone: "+225 07 44 55 66", projectsCount: 1, totalValue: "9 800 000 FCFA" },
  ];

  if ((await prisma.client.count()) === 0) {
    await prisma.client.createMany({ data: clients });
  }
  console.log(`✓ ${clients.length} clients`);

  const testimonials = [
    {
      name: "Jean-Marc A.",
      role: "Propriétaire — Villa à Bonapriso",
      poleId: "piscines",
      rating: 5,
      quoteFr:
        "Le résultat dépasse nos attentes : la piscine à débordement miroir est devenue la pièce maîtresse de notre propriété. Un travail minutieux du premier plan à la dernière finition.",
      quoteEn:
        "The result exceeded our expectations: the mirror infinity pool has become the centrepiece of our property. Meticulous work from the first blueprint to the final finish.",
    },
    {
      name: "Sylvie K.",
      role: "Directrice — Sté Horizon SA",
      poleId: "btp",
      rating: 5,
      quoteFr:
        "Un seul interlocuteur du permis de construire à la livraison, des délais tenus et une qualité de finition remarquable sur l'ensemble du chantier.",
      quoteEn:
        "A single point of contact from the building permit to delivery, deadlines met, and remarkable finishing quality across the entire site.",
    },
    {
      name: "Paul N.",
      role: "Responsable technique — Complexe sportif",
      poleId: "formation",
      rating: 5,
      quoteFr:
        "Nos maîtres-nageurs ont été formés avec une rigueur exemplaire. L'équipe MN3J-GROUP a su s'adapter au niveau de chaque candidat.",
      quoteEn:
        "Our lifeguards were trained with exemplary rigour. The MN3J-GROUP team adapted perfectly to each candidate's level.",
    },
    {
      name: "Amélie T.",
      role: "Particulière — Riviera",
      poleId: "decoration",
      rating: 4,
      quoteFr:
        "De la terrasse au salon, chaque espace a été pensé dans le moindre détail. Une équipe à l'écoute et un rendu qui a transformé notre quotidien.",
      quoteEn:
        "From the terrace to the living room, every space was thought through to the smallest detail. An attentive team and a result that transformed our everyday life.",
    },
  ];

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: testimonials });
  }
  console.log(`✓ ${testimonials.length} témoignages`);

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "MN3J-GROUP Sarl",
      street: "PK8",
      city: "Douala-Ndokoti",
      country: "Cameroun",
      phone: "+237 6 73 77 24 76",
      email: "mn3jgroup@gmail.com",
      hoursJson: JSON.stringify([
        { day: "Lundi – Vendredi", time: "8h00 – 18h00" },
        { day: "Samedi", time: "9h00 – 14h00" },
        { day: "Dimanche", time: "Fermé" },
      ]),
      lat: 4.0435,
      lng: 9.7424,
      socialJson: JSON.stringify({
        youtube: "https://youtube.com",
        linkedin: "https://linkedin.com",
        tiktok: "https://tiktok.com",
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
      }),
    },
  });
  console.log("✓ Paramètres du site");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
