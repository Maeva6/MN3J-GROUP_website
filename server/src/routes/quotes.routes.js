import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { quoteRateLimiter } from "../middleware/rateLimiter.js";
import { notifyNewQuote } from "../lib/mailer.js";

export const quotesRouter = Router();

const QUOTE_STATUSES = ["Nouveau", "Contacté", "Accepté", "Refusé"];

const createQuoteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  projectType: z.string().min(1),
  budget: z.string().min(1),
  message: z.string().min(1),
});

// POST /api/quotes — public : c'est ce qu'appellera à terme le formulaire
// de contact (src/pages/Contact.jsx). Non branché pour l'instant.
quotesRouter.post(
  "/",
  quoteRateLimiter,
  asyncHandler(async (req, res) => {
    const data = createQuoteSchema.parse(req.body);
    const quote = await prisma.quote.create({ data });

    notifyNewQuote(quote).catch((err) => console.error("[mailer] échec de la notification :", err.message));

    res.status(201).json(quote);
  })
);

// Tout le reste (consultation et gestion des demandes) est réservé à l'admin.
quotesRouter.use(requireAuth);

quotesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const quotes = await prisma.quote.findMany({
      where: status ? { status: String(status) } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.json(quotes);
  })
);

// GET /api/quotes/stats — comptage par statut + taux de conversion, pour les
// cartes KPI / le mini-graphique / la jauge du dashboard admin (évite de
// rapatrier tous les devis côté client juste pour les compter).
quotesRouter.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const grouped = await prisma.quote.groupBy({ by: ["status"], _count: { status: true } });
    const byStatus = Object.fromEntries(QUOTE_STATUSES.map((s) => [s, 0]));
    for (const g of grouped) byStatus[g.status] = g._count.status;

    const total = Object.values(byStatus).reduce((sum, n) => sum + n, 0);
    const conversionRate = total ? Math.round((byStatus["Accepté"] / total) * 100) : 0;

    res.json({ byStatus, total, conversionRate });
  })
);

quotesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: z.enum(QUOTE_STATUSES) }).parse(req.body);
    const quote = await prisma.quote.update({ where: { id: req.params.id }, data: { status } });
    res.json(quote);
  })
);

quotesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.quote.delete({ where: { id: req.params.id } });
    res.status(204).end();
  })
);
