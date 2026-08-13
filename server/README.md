# MN3J-GROUP — API back-end

API REST pour le site MN3J-GROUP. **Pas encore branchée au frontend** (`src/`
continue de lire ses données statiques dans `src/data/*.js`) — ce dossier
sert à valider la logique côté serveur avant de connecter les deux, une
fois le frontend validé auprès du client.

## Stack

- Node.js + Express
- Prisma ORM + SQLite (fichier `prisma/dev.db` en local)
- JWT (jsonwebtoken) + bcrypt pour l'authentification admin
- multer pour l'upload de photos de chantiers
- nodemailer (optionnel) pour notifier par e-mail une nouvelle demande de devis
- zod pour la validation des données entrantes
- helmet, cors, express-rate-limit pour un minimum de durcissement

## Démarrer en local

```bash
cd server
npm install
cp .env.example .env       # puis ajustez les valeurs (voir ci-dessous)
npm run prisma:migrate     # crée prisma/dev.db et applique le schéma
npm run prisma:seed        # remplit la base avec les données de démo du frontend
npm run dev                # démarre l'API sur http://localhost:4000
```

`npm run prisma:studio` ouvre une interface graphique pour explorer/éditer
la base (pratique pour vérifier les données sans écrire de requêtes).

## Variables d'environnement (`.env`)

Voir `.env.example` pour le détail de chaque variable. À noter :

- `ADMIN_EMAIL` / `ADMIN_PASSWORD` : compte créé par `npm run prisma:seed`.
- `JWT_SECRET` : à changer avant tout déploiement réel.
- `SMTP_*` : si laissés vides, l'API fonctionne normalement mais aucun
  e-mail n'est envoyé à la création d'une demande de devis (juste
  enregistrée en base — voir `src/lib/mailer.js`).
- `DATABASE_URL` : SQLite en local. ⚠️ Pour un déploiement sur Vercel (ou
  toute plateforme serverless), il faudra pointer vers une base hébergée
  (Postgres via Neon/Supabase/Vercel Postgres…) — le système de fichiers
  des fonctions serverless n'est pas persistant, un fichier SQLite n'y
  survit pas entre deux requêtes.

## Modèle de données (`prisma/schema.prisma`)

Chaque table reprend la structure déjà utilisée côté frontend, pour que
brancher les deux plus tard soit une simple substitution de source de
données plutôt qu'un redesign :

| Table | Reflète |
| --- | --- |
| `AdminUser` | Authentification `/admin` (remplace le mot de passe unique client-side de `src/utils/adminAuth.js`) |
| `Project` | `src/data/projects.js` |
| `Quote` | Le formulaire de contact (`src/pages/Contact.jsx`) + `src/data/adminData.js` |
| `Client` | `src/data/adminData.js` |
| `Testimonial` | `src/data/testimonials.js` + `data.testimonials` dans `src/i18n/{fr,en}.js` |
| `SiteSetting` | `src/data/siteConfig.js` (ligne unique, id fixe) |

Le script `prisma/seed.js` reprend telles quelles les données de démo déjà
visibles sur le site, pour que l'API renvoie exactement ce que le frontend
affiche aujourd'hui en dur.

## Endpoints

Tous les endpoints sont préfixés par `/api`. Les routes marquées 🔒
nécessitent un header `Authorization: Bearer <token>` (obtenu via
`POST /auth/login`).

### Auth
- `POST /auth/login` — `{ email, password }` → `{ token, admin }`
- `GET /auth/me` 🔒

### Chantiers (`/projects`)
- `GET /projects` — public, filtres optionnels `?poleId=&status=`
- `GET /projects/:slug` — public
- `POST /projects` 🔒
- `PUT /projects/:id` 🔒
- `DELETE /projects/:id` 🔒
- `POST /projects/:id/image` 🔒 — upload multipart (champ `image`), stocke le fichier dans `uploads/` et met à jour `imageUrl`

### Devis (`/quotes`)
- `POST /quotes` — **public**, c'est l'endpoint que le formulaire de
  contact appellera une fois branché. Limité à 10 requêtes / 15 min par IP.
- `GET /quotes` 🔒 — filtre optionnel `?status=`
- `PATCH /quotes/:id` 🔒 — `{ status }`
- `DELETE /quotes/:id` 🔒

### Clients (`/clients`) — tout 🔒
- `GET /clients`, `POST /clients`, `PUT /clients/:id`, `DELETE /clients/:id`

### Témoignages (`/testimonials`)
- `GET /testimonials` — public
- `POST /testimonials` 🔒, `PUT /testimonials/:id` 🔒, `DELETE /testimonials/:id` 🔒

### Paramètres (`/settings`)
- `GET /settings` — public
- `PUT /settings` 🔒

### Divers
- `GET /health` — vérification de disponibilité

## Exemple rapide (curl)

```bash
# Connexion admin
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mn3jgroup.com","password":"<votre mot de passe>"}'

# Demande de devis publique (ce que fera le formulaire de contact)
curl -X POST http://localhost:4000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{"name":"Jean Dupont","email":"jean@example.com","phone":"+237600000000","projectType":"BTP","budget":"5M FCFA","message":"Bonjour, ..."}'
```

## Pour brancher le frontend plus tard

Non fait volontairement (validation du frontend en cours auprès du
client). Quand ce sera décidé, les changements côté `src/` seront
localisés :

1. Remplacer les imports directs de `src/data/{projects,testimonials,siteConfig}.js`
   et `src/data/adminData.js` par des appels `fetch` vers cette API
   (probablement via un petit hook `useFetch`/`useSWR` par ressource).
2. `src/utils/adminAuth.js` : remplacer la comparaison de mot de passe
   local par un appel à `POST /api/auth/login`, et stocker le JWT reçu à
   la place du flag `sessionStorage` actuel.
3. Les pages `src/pages/admin/Admin*.jsx` : remplacer les `useState`
   locaux (données en mémoire, perdues au rechargement) par des appels
   API réels vers `/projects`, `/quotes`, `/clients`, `/settings`.
4. `src/pages/Contact.jsx` : le `handleSubmit` actuel (`setSent(true)`
   sans rien envoyer) appellera `POST /api/quotes`.
5. Définir `VITE_API_URL` côté frontend et `CORS_ORIGIN` côté API pour
   qu'ils s'autorisent mutuellement une fois déployés.
