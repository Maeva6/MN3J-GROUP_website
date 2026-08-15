# DevOps — MN3J-GROUP

Exercice d'apprentissage DevOps mené sur ce projet : conteneurisation,
CI/CD, orchestration, monitoring et Infrastructure as Code, appliqués au
back-end (`server/`). **Rien de tout cela ne connecte le frontend au
back-end** — c'est volontaire, en attendant la validation de l'interface
par le client (voir `server/README.md`, section "Pour brancher le
frontend plus tard").

## Vue d'ensemble des 6 chantiers

| # | Outil(s) | Dossier / fichier | Statut |
| - | -------- | ------------------ | ------ |
| 1 | Docker + Docker Compose + Postgres | `server/Dockerfile`, `docker-compose.yml` | ✅ Postgres migré et testé, image à valider (voir "État actuel") |
| 2 | Traefik | `docker-compose.yml` (service `traefik`) | ✅ Configuré, à valider avec la stack |
| 3 | GitHub Actions | `.github/workflows/*.yml` | ✅ Écrit et validé (YAML), se déclenchera au prochain push |
| 4 | GitHub Container Registry | `.github/workflows/backend-ci.yml` | ✅ Configuré (`ghcr.io/<owner>/mn3j-group-api`) |
| 5 | Jenkins | `jenkins/` | ✅ Écrit, à valider avec Docker |
| 6 | Kubernetes, Prometheus/Grafana, Terraform | `k8s/`, `monitoring/`, `terraform/` | ✅ Écrits ; Terraform installé et `init`/`validate` passés, `plan`/`apply` à refaire avec Docker up |

## État actuel (important)

Docker Desktop a cessé de répondre (`docker info` en erreur 500) pendant
la mise en place — probablement un souci ponctuel du moteur, sans rapport
avec la config elle-même (Postgres avait déjà tourné et servi une
migration juste avant). **Ce qui a été vérifié avant l'interruption :**

- Migration Prisma SQLite → Postgres : faite, testée, seed exécuté avec succès.
- Un conflit de port a été détecté et corrigé : un Postgres natif tournait
  déjà sur le port 5432 de la machine ; `docker-compose.yml` utilise donc
  **5433** côté hôte pour ne pas y toucher.
- Tests + lint backend : passent (`npm run lint` / `npm test` dans `server/`).
- `/metrics` (Prometheus) : testé directement en local, fonctionne.
- Terraform : installé, `terraform init` et `terraform validate` passent.

**Ce qui reste à confirmer une fois Docker à nouveau opérationnel :**
`docker compose up --build` (stack complète), l'accès via Traefik
(`api.localhost`), Jenkins, le monitoring, et `terraform plan`/`apply`.
→ Redémarrez Docker Desktop puis dites-le-moi, je referai passer toute la
stack pour vérifier de bout en bout.

## Démarrage rapide (une fois Docker opérationnel)

```bash
# 1. Stack principale : Postgres + API + Traefik + Adminer
docker compose up -d --build
curl http://api.localhost/api/health
# Adminer : http://adminer.localhost — Dashboard Traefik : http://localhost:8080

# 2. Monitoring (optionnel, nécessite la stack principale démarrée)
docker compose -f docker-compose.monitoring.yml up -d
# Prometheus : http://localhost:9090 — Grafana : http://localhost:3001 (admin/admin)

# 3. Jenkins (optionnel, indépendant)
docker compose -f jenkins/docker-compose.yml up --build -d
# UI : http://localhost:8090 — voir jenkins/README.md pour le mot de passe initial

# 4. Terraform (optionnel, alternative "IaC" à l'étape 1)
cd terraform && terraform init && terraform plan
```

## Carte des ports (pour éviter les conflits)

| Port hôte | Service |
| --- | --- |
| 80 | Traefik (entrée HTTP → `api.localhost`, `adminer.localhost`) |
| 8080 | Dashboard Traefik |
| 5433 | Postgres (docker-compose.yml) — **pas 5432**, déjà pris par un Postgres natif sur cette machine |
| 8090 | Jenkins |
| 9090 | Prometheus |
| 3001 | Grafana — pas 3000, souvent pris par un serveur de dev local |
| 5434 / 4001 | Postgres / API via Terraform (module séparé, pour tourner en parallèle de docker-compose.yml si besoin) |

## Pourquoi ces choix

- **Postgres plutôt que SQLite** : SQLite ne survit pas sur une plateforme
  serverless (Vercel) et n'est pas idéal en environnement conteneurisé
  multi-instance ; Postgres est le choix réaliste pour la suite.
- **Traefik plutôt que Nginx** : découverte automatique des services via
  labels Docker, pas de fichier de config à maintenir à la main pour
  chaque nouveau service — plus adapté à un environnement Compose/K8s qui
  évolue.
- **GitHub Actions en priorité sur Jenkins** : déjà intégré à GitHub (où
  vit le repo), zéro infra à maintenir. Jenkins reste présent en parallèle
  comme exercice (self-hosted CI, très répandu en entreprise).
- **Kubernetes / Terraform en "optionnel"** : clairement surdimensionnés
  pour la taille actuelle du projet — leur intérêt ici est pédagogique,
  pas opérationnel.

## Pour aller plus loin dans chaque chantier

- Backend / Docker / Compose : `server/README.md`
- Jenkins : `jenkins/README.md`
- Kubernetes : `k8s/README.md`
- Terraform : `terraform/README.md`
