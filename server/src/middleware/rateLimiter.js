import rateLimit from "express-rate-limit";

// Limite les demandes de devis publiques (anti-spam / anti-bot basique).
export const quoteRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de demandes envoyées, réessayez plus tard." },
});

// Limite les tentatives de connexion admin (anti brute-force).
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives de connexion, réessayez plus tard." },
});
