import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";

export const testimonialsRouter = Router();

const POLE_IDS = ["piscines", "decoration", "btp", "formation"];

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  poleId: z.enum(POLE_IDS),
  rating: z.number().int().min(1).max(5).default(5),
  quoteFr: z.string().min(1),
  quoteEn: z.string().min(1),
});

// GET /api/testimonials — public (section "Ils nous font confiance" de la page d'accueil).
testimonialsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
    res.json(testimonials);
  })
);

testimonialsRouter.use(requireAuth);

testimonialsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = testimonialSchema.parse(req.body);
    const testimonial = await prisma.testimonial.create({ data });
    res.status(201).json(testimonial);
  })
);

testimonialsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = testimonialSchema.partial().parse(req.body);
    const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data });
    res.json(testimonial);
  })
);

testimonialsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.status(204).end();
  })
);
