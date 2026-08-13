import { verifyToken } from "../lib/jwt.js";

// Protège une route : exige un header "Authorization: Bearer <token>" valide.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentification requise." });
  }

  try {
    req.admin = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Session invalide ou expirée." });
  }
}
