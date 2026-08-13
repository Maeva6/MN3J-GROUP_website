import { ZodError } from "zod";

// Enveloppe un handler async pour transmettre ses erreurs à Express sans try/catch répété.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route inconnue : ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Données invalides.", details: err.flatten() });
  }

  if (err?.code === "P2002") {
    return res.status(409).json({ error: "Cette valeur existe déjà (conflit d'unicité)." });
  }
  if (err?.code === "P2025") {
    return res.status(404).json({ error: "Ressource introuvable." });
  }

  console.error(err);
  res.status(err.status || 500).json({ error: err.publicMessage || "Erreur interne du serveur." });
}
