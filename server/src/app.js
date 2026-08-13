import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { quotesRouter } from "./routes/quotes.routes.js";
import { clientsRouter } from "./routes/clients.routes.js";
import { testimonialsRouter } from "./routes/testimonials.routes.js";
import { settingsRouter } from "./routes/settings.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { UPLOADS_DIR } from "./middleware/upload.js";

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

export function createApp() {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json());

  // Photos uploadées (voir POST /api/projects/:id/image).
  app.use("/uploads", express.static(UPLOADS_DIR));

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/quotes", quotesRouter);
  app.use("/api/clients", clientsRouter);
  app.use("/api/testimonials", testimonialsRouter);
  app.use("/api/settings", settingsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
