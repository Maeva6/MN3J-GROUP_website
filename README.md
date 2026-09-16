# MN3J-GROUP — Site web

Site vitrine + back-office pour MN3J-GROUP Sarl (piscines haut de gamme,
décoration, BTP, formation aquatique).

> Une API back-end complète existe dans [`server/`](server/README.md)
> (Node/Express + Prisma). Seule l'**authentification** de `/admin` y est
> branchée (voir ci-dessous) : le reste du back-office (chantiers, devis,
> clients affichés) continue de lire ses données statiques dans
> `src/data/*.js` en attendant la validation du site auprès du client.
>
> Toute la partie infrastructure (Docker, Traefik, CI/CD, Kubernetes,
> monitoring, Terraform) est documentée dans [`DEVOPS.md`](DEVOPS.md).

## Stack

- React 19 + Vite
- React Router (navigation, y compris les routes imbriquées `/admin/*`)
- Tailwind CSS (design system : voir `tailwind.config.js`)
- Framer Motion (animations)
- lucide-react (icônes)
- i18n maison (FR/EN) — `src/i18n/` (pas de librairie externe)
- `vite-plugin-image-optimizer` — compresse automatiquement toutes les
  images au moment du build, quel que soit leur format d'origine

## Démarrer le projet

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production dans /dist
npm run preview   # prévisualiser le build de production
```

## Variables d'environnement

Copiez `.env.example` en `.env` à la racine du projet :

```bash
cp .env.example .env
```

| Variable | Rôle |
| --- | --- |
| `VITE_API_URL` | URL de l'API back-end (`server/`) qui gère l'authentification `/admin` (JWT signé, mot de passe hashé côté serveur — voir `server/README.md`). En local : `http://localhost:4000`. |
| `VITE_GA_MEASUREMENT_ID` | Optionnel — Google Analytics 4. Laissez vide pour ne charger aucun script de suivi. |

`.env` est ignoré par Git (`.gitignore`). Sur Vercel, définissez
`VITE_API_URL` dans **Project Settings → Environment Variables** avec
l'URL publique de l'API déployée (sans quoi la connexion à `/admin` échoue :
il n'y a plus de mot de passe de secours codé côté frontend).

## Déploiement (Vercel)

Le site est un SPA (toute la navigation, y compris `/admin`, est gérée côté
client par React Router). Sans configuration particulière, Vercel renvoie
une 404 sur toute URL tapée directement dans le navigateur (autre que `/`),
car aucun fichier physique n'existe à ce chemin sur le serveur.

`vercel.json` corrige ça en renvoyant `index.html` pour toutes les routes,
et laisse React Router prendre le relais :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [ /* HSTS, cache long sur /assets/, en-têtes de sécurité — voir vercel.json */ ]
}
```

Pensez aussi à configurer `VITE_API_URL` dans les variables d'environnement
du projet Vercel, avec l'URL publique de l'API déployée (voir section
précédente).

## Structure

```
src/
  components/
    admin/        Modal (back-office)
    Navbar, Footer, SocialIcons, PhotoFrame, StatsBar, ProjectCard,
    BeforeAfterSlider, Testimonials, Seo
  pages/
    admin/         AdminLogin, RequireAdminAuth, AdminLayout,
                    AdminDashboard, AdminChantiers, AdminDevis,
                    AdminClients, AdminParametres
    Home, Projects, ProjectDetail, Services, PoleDetail,
    SubServiceDetail, About, Contact, NotFound
  data/            siteConfig.js, services.js, projects.js,
                    testimonials.js, adminData.js (devis/clients de démo)
  i18n/            fr.js, en.js, LanguageContext.jsx
  utils/           adminAuth.js
```

## Fonctionnalités clés

- **Site bilingue FR/EN**, texte géré via `src/i18n/{fr,en}.js` et le hook
  `useLanguage()`.
- **4 pôles de services** (piscines, décoration, BTP, formation), chacun
  avec sa page hub (`/services/:poleId`) et une page dédiée par sous-type
  (`/services/:poleId/:subId`), plus une page Entretien.
- **Back-office `/admin`** protégé par mot de passe (voir plus haut),
  avec gestion des chantiers, devis, clients et paramètres. Les
  modifications faites dans l'admin sont en mémoire uniquement (pas de
  backend) — voir la section "À compléter" ci-dessous.
- **SEO de base** : `<title>`/meta description dynamiques par page
  (`src/components/Seo.jsx`), Open Graph/Twitter statiques dans
  `index.html`, `robots.txt`.
- **Page 404** dédiée pour toute route inconnue.
- **Optimisation d'images automatique** au build (voir Stack ci-dessus).

## ⚠️ À compléter avant mise en ligne

1. **`src/data/siteConfig.js`** — vérifiez l'adresse, le téléphone,
   l'email, les coordonnées GPS (`map`) et les réseaux sociaux réels de
   l'entreprise. Un seul fichier à corriger : tout le reste du site s'y
   réfère automatiquement.
2. **`src/pages/About.jsx`** — noms et rôles réels de l'équipe
   (actuellement "À compléter"), et certifications réelles détenues par
   l'entreprise.
3. **`src/data/projects.js`** — remplacez les chantiers d'exemple par vos
   vrais chantiers (réalisés / en cours / planifiés).
4. **`src/data/testimonials.js` + `data.testimonials` dans `src/i18n/`** —
   témoignages de démonstration à remplacer par de vrais retours clients.
5. **Formulaire de contact** (`src/pages/Contact.jsx`) — le
   `handleSubmit` est un placeholder ; à brancher sur une vraie API
   (envoi e-mail / enregistrement en base). Les demandes de devis de
   l'admin (`src/data/adminData.js`) sont aussi des données de démo, pour
   la même raison.
6. **Back-office** (`/admin`) — protégé par mot de passe local (voir
   "Variables d'environnement"), mais pas par une vraie authentification
   serveur. À renforcer avant un usage sensible en production.
7. **Budget estimé** (`src/i18n/{fr,en}.js` → `contact.budgetOptions`) —
   tranches en FCFA à confirmer selon votre marché réel.
