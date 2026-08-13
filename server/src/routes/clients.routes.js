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

clientsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
    res.json(clients);
  })
);

clientsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = clientSchema.parse(req.body);
    const client = await prisma.client.create({ data });
    res.status(201).json(client);
  })
);

clientsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = clientSchema.partial().parse(req.body);
    const client = await prisma.client.update({ where: { id: req.params.id }, data });
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
