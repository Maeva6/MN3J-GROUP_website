import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signAdminToken } from "../lib/jwt.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post(
  "/login",
  loginRateLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
    const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

    if (!admin || !valid) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    const token = signAdminToken(admin);
    res.json({
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const admin = await prisma.adminUser.findUnique({ where: { id: req.admin.sub } });
    if (!admin) return res.status(404).json({ error: "Compte introuvable." });
    res.json({ id: admin.id, email: admin.email, name: admin.name });
  })
);
