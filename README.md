# MN3J-GROUP — Site web

Site vitrine + back-office pour MN3J-GROUP Sarl (formation aquatique,
piscines haut de gamme, décoration, BTP).

## Stack

- React 19 + Vite
- React Router (navigation)
- Tailwind CSS (design system : voir `tailwind.config.js`)
- Framer Motion (animations)
- lucide-react (icônes)

## Démarrer le projet

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production dans /dist
npm run preview   # prévisualiser le build de production
```

## ⚠️ À compléter avant mise en ligne

1. **`src/data/siteConfig.js`** — adresse, téléphone, email, réseaux
   sociaux réels de l'entreprise. Un seul fichier à corriger : tout le
   reste du site s'y réfère automatiquement.
2. **Photos réelles** — toutes les images sont actuellement des
   placeholders dégradés (composant `src/components/PhotoFrame.jsx`).
   Remplacez-les en passant une prop `src="/chemin/vers/photo.jpg"`.
3. **`src/pages/About.jsx`** — noms et rôles réels de l'équipe
   (actuellement "À compléter"), et certifications réelles détenues par
   l'entreprise.
4. **`src/data/projects.js`** — remplacez les chantiers d'exemple par vos
   vrais chantiers (réalisés / en cours / planifiés).
5. **Formulaire de contact** (`src/pages/Contact.jsx`) — le
   `handleSubmit` est un placeholder ; à brancher sur une vraie API
   (envoi e-mail / enregistrement en base).
6. **Back-office** (`/admin`) — aucune authentification n'est en place ;
   à protéger avant mise en production.

## Structure

```
src/
  components/   Navbar, Footer, SocialIcons, PhotoFrame, StatsBar,
                ProjectCard, BeforeAfterSlider
  pages/        Home, Projects, ProjectDetail, Services, About,
                Contact, Admin
  data/         siteConfig.js, services.js, projects.js
```
