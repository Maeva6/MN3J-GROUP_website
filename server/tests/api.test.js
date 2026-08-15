import { test, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

// Tests volontairement indépendants d'une vraie base de données : ils ne
// couvrent que ce qui est validé/rejeté AVANT toute requête Prisma
// (validation zod, garde d'authentification, 404). Suffisant pour une CI
// rapide ; les parcours qui touchent réellement la base sont vérifiés
// manuellement (voir server/README.md) le temps que le projet ait une
// vraie base de test dédiée.

process.env.JWT_SECRET ??= "test-secret";
process.env.JWT_EXPIRES_IN ??= "1h";
process.env.CORS_ORIGIN ??= "http://localhost:5173";

const { createApp } = await import("../src/app.js");
let app;

before(() => {
  app = createApp();
});

test("GET /api/health répond 200 ok", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
});

test("GET /route/inconnue répond 404", async () => {
  const res = await request(app).get("/api/route-qui-nexiste-pas");
  assert.equal(res.status, 404);
});

test("POST /api/auth/login rejette un email invalide (400)", async () => {
  const res = await request(app).post("/api/auth/login").send({ email: "pas-un-email", password: "x" });
  assert.equal(res.status, 400);
});

test("POST /api/quotes rejette une demande incomplète (400)", async () => {
  const res = await request(app).post("/api/quotes").send({ name: "" });
  assert.equal(res.status, 400);
});

test("GET /api/quotes sans token répond 401", async () => {
  const res = await request(app).get("/api/quotes");
  assert.equal(res.status, 401);
});

test("GET /api/projects/:id sans token répond 401 pour la modification", async () => {
  const res = await request(app).delete("/api/projects/some-id");
  assert.equal(res.status, 401);
});

test("GET /api/auth/me avec un token invalide répond 401", async () => {
  const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer not-a-real-token");
  assert.equal(res.status, 401);
});
