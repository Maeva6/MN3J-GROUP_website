import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";

export const clientsRouter = Router();

// Données internes : tout l'espace clients est réservé à l'admin.
clientsRouter.use(requireAuth);

const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  projectsCount: z.number().int().min(0).default(0),
  totalValue: z.string().default(""),
});

// `totalValue` reste le champ d'affichage (texte formaté, ex. "45 000 000
// FCFA"), saisi tel quel par le formulaire admin. `totalValueXaf` (numérique,
// pour les agrégations) en est dérivé automatiquement ici plutôt que d'exiger
// deux champs redondants côté appelant.
function parseFcfa(value) {
  return Number(String(value).replace(/[^\d]/g, "")) || 0;
}

clientsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
    res.json(clients);
  })
);

// GET /api/clients/stats — agrégats pour le dashboard admin (cartes KPI).
clientsRouter.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const [totalClients, agg] = await Promise.all([
      prisma.client.count(),
      prisma.client.aggregate({ _sum: { totalValueXaf: true } }),
    ]);
    res.json({ totalClients, totalValueXaf: agg._sum.totalValueXaf ?? 0 });
  })
);

clientsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = clientSchema.parse(req.body);
    const client = await prisma.client.create({ data: { ...data, totalValueXaf: parseFcfa(data.totalValue) } });
    res.status(201).json(client);
  })
);

clientsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = clientSchema.partial().parse(req.body);
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: { ...data, ...(data.totalValue !== undefined ? { totalValueXaf: parseFcfa(data.totalValue) } : {}) },
    });
    res.json(client);
  })
);

clientsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.client.delete({ where: { id: req.params.id } });
    res.status(204).end();
  })
);
