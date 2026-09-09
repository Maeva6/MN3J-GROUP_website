// Génère public/sitemap.xml à partir des données du site (pôles, déclinaisons,
// chantiers) plutôt que de le maintenir à la main — un pôle ou un chantier
// ajouté dans src/data/*.js apparaît automatiquement au prochain build.
// Lancé automatiquement avant chaque build (voir "prebuild" dans package.json).
//
// Utilise Vite en mode SSR (ssrLoadModule) pour charger src/data/services.js
// et src/data/projects.js tels quels : ces fichiers importent des images
// (ex. `import img from "../assets/images/x.jpg"`), que Node seul ne sait pas
// résoudre, mais que Vite résout normalement (on ne se sert ici que des id/clés,
// pas des URLs d'images obtenues).
import { createServer } from "vite";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ⚠️ À corriger si le domaine de production change (voir aussi index.html
// pour og:image/twitter:image, qui doivent rester des URLs absolues).
const SITE_URL = "https://mn-3-j-group-website.vercel.app";

async function loadSiteData() {
  const server = await createServer({
    root: ROOT,
    server: { middlewareMode: true },
    logLevel: "error",
  });
  const { services, maintenanceService } = await server.ssrLoadModule("/src/data/services.js");
  const { projects } = await server.ssrLoadModule("/src/data/projects.js");
  await server.close();
  return { services, maintenanceService, projects };
}

function buildUrls({ services, maintenanceService, projects }) {
  const urls = [];
  const add = (loc, { changefreq, priority }) => urls.push({ loc, changefreq, priority });

  add("/", { changefreq: "weekly", priority: "1.0" });
  add("/chantiers", { changefreq: "weekly", priority: "0.8" });
  add("/services", { changefreq: "weekly", priority: "0.8" });
  add("/a-propos", { changefreq: "monthly", priority: "0.6" });
  add("/contact", { changefreq: "monthly", priority: "0.7" });
  add("/faq", { changefreq: "monthly", priority: "0.5" });
  add("/politique-de-confidentialite", { changefreq: "yearly", priority: "0.3" });
  // Pas de /merci (page de remerciement post-formulaire, aucun intérêt SEO,
  // déjà exclue via robots.txt) ni de /admin/* (back-office, protégé par mot
  // de passe et exclu via robots.txt).

  for (const project of projects) {
    add(`/chantiers/${project.id}`, { changefreq: "monthly", priority: "0.6" });
  }

  for (const pole of services) {
    add(`/services/${pole.id}`, { changefreq: "monthly", priority: "0.7" });
    for (const subId of Object.keys(pole.subImages ?? {})) {
      add(`/services/${pole.id}/${subId}`, { changefreq: "monthly", priority: "0.6" });
    }
  }
  // Entretien de piscine : rubrique complémentaire, une seule page (pas de
  // déclinaisons routées individuellement, voir PoleDetail.jsx `isMaintenance`).
  add(`/services/${maintenanceService.id}`, { changefreq: "monthly", priority: "0.6" });

  return urls;
}

function toXml(urls) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const items = urls
    .map(
      ({ loc, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}

const data = await loadSiteData();
const urls = buildUrls(data);
const xml = toXml(urls);
writeFileSync(path.join(ROOT, "public/sitemap.xml"), xml, "utf-8");
console.log(`sitemap.xml généré avec ${urls.length} URLs.`);
