import "dotenv/config";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 4000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET manquant dans .env — copiez .env.example en .env avant de démarrer.");
  process.exit(1);
}

const app = createApp();

app.listen(PORT, () => {
  console.log(`MN3J-GROUP API en écoute sur http://localhost:${PORT}`);
});
