import { PrismaClient } from "@prisma/client";

// Instance unique du client Prisma, réutilisée par toute l'app (évite
// d'épuiser les connexions en développement avec le rechargement à chaud).
export const prisma = new PrismaClient();
