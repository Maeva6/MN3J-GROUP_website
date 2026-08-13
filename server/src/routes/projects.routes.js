import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

export const projectsRouter = Router();

const POLE_IDS = ["piscines", "decoration", "btp", "formation"];
const STATUSES = ["Réalisé", "En cours", "Planifié"];

const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Le slug doit être en minuscules, sans espaces (ex: villa-les-palmiers)."),
  name: z.string().min(1),
  poleId: z.enum(POLE_IDS),
  category: z.string().min(1),
  location: z.string().min(1),
  status: z.enum(STATUSES),
  progress: z.number().int().min(0).max(100),
  year: z.string().min(1),
  duration: z.string().min(1),
  client: z.string().min(1),
  description: z.string().min(1),
});

// GET /api/projects — public (alimente la page "Chantiers" du site).
projectsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { poleId, status } = req.query;
    const projects = await prisma.project.findMany({
      where: {
        ...(poleId ? { poleId: String(poleId) } : {}),
        ...(status ? { status: String(status) } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  })
);

// GET /api/projects/:slug — public.
projectsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
    if (!project) return res.status(404).json({ error: "Chantier introuvable." });
    res.json(project);
  })
);

// Tout ce qui suit modifie les données : réservé à l'admin authentifié.
projectsRouter.use(requireAuth);

projectsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({ data });
    res.status(201).json(project);
  })
);

projectsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = projectSchema.partial().parse(req.body);
    const project = await prisma.project.update({ where: { id: req.params.id }, data });
    res.json(project);
  })
);

projectsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).end();
  })
);

// POST /api/projects/:id/image — upload d'une photo de chantier.
projectsRouter.post(
  "/:id/image",
  uploadImage.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu (champ attendu : image)." });
    const imageUrl = `/uploads/${req.file.filename}`;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { imageUrl },
    });
    res.json(project);
  })
);
