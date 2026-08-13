import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";

export const settingsRouter = Router();

const SETTINGS_ID = 1;

// Reforme la ligne SQLite (à plat) dans la structure attendue par le
// frontend (src/data/siteConfig.js) : { address: {...}, hours: [...], map: {...}, social: {...} }.
function toClientShape(row) {
  return {
    companyName: row.companyName,
    address: { street: row.street, city: row.city, country: row.country },
    phone: row.phone,
    email: row.email,
    hours: JSON.parse(row.hoursJson),
    map: { lat: row.lat, lng: row.lng },
    social: JSON.parse(row.socialJson),
    updatedAt: row.updatedAt,
  };
}

const settingsSchema = z.object({
  companyName: z.string().min(1),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }),
  phone: z.string().min(1),
  email: z.string().email(),
  hours: z.array(z.object({ day: z.string(), time: z.string() })),
  map: z.object({ lat: z.number().nullable(), lng: z.number().nullable() }),
  social: z.object({
    youtube: z.string(),
    linkedin: z.string(),
    tiktok: z.string(),
    instagram: z.string(),
    facebook: z.string(),
  }),
});

// GET /api/settings — public (Footer, page Contact, etc. en ont besoin côté site).
settingsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const row = await prisma.siteSetting.findUnique({ where: { id: SETTINGS_ID } });
    if (!row) return res.status(404).json({ error: "Paramètres non initialisés (lancez le seed)." });
    res.json(toClientShape(row));
  })
);

settingsRouter.put(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = settingsSchema.parse(req.body);
    const row = await prisma.siteSetting.update({
      where: { id: SETTINGS_ID },
      data: {
        companyName: data.companyName,
        street: data.address.street,
        city: data.address.city,
        country: data.address.country,
        phone: data.phone,
        email: data.email,
        hoursJson: JSON.stringify(data.hours),
        lat: data.map.lat,
        lng: data.map.lng,
        socialJson: JSON.stringify(data.social),
      },
    });
    res.json(toClientShape(row));
  })
);
