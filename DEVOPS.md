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
| 1 | Docker + Docker Compose + Postgres | `server/Dockerfile`, `docker-compose.yml` | ✅ Testé de bout en bout |
| 2 | Traefik | `docker-compose.yml` (service `traefik`), `traefik/dynamic.yml` | ✅ Testé de bout en bout (routage par fichier, voir "Incidents rencontrés") |
| 3 | GitHub Actions | `.github/workflows/*.yml` | ✅ Écrit et validé (YAML) ; se déclenchera au prochain push |
| 4 | GitHub Container Registry | `.github/workflows/backend-ci.yml` | ✅ Configuré (`ghcr.io/<owner>/mn3j-group-api`) |
| 5 | Jenkins | `jenkins/` | ✅ Testé : build + démarrage + UI accessible |
| 6a | Kubernetes | `k8s/` | ✅ Écrit, validé en syntaxe (pas de cluster local disponible pour un test réel — voir `k8s/README.md`) |
| 6b | Prometheus / Grafana | `monitoring/` | ✅ Testé de bout en bout (scrape actif, datasource provisionnée) |
| 6c | Terraform | `terraform/` | ✅ Testé de bout en bout : `init`/`validate`/`plan`/`apply`/`destroy` |

## État actuel : tout est vérifié

Tout ce qui pouvait être testé localement l'a été, avec succès :

- **Stack principale** (`docker compose up -d --build`) : Postgres, API,
  Traefik, Adminer tous opérationnels. Login, routes publiques et routes
  protégées testés à travers Traefik (`http://api.localhost`).
- **Jenkins** : image construite (plugins inclus), conteneur démarré, UI
  accessible sur `http://localhost:8090`.
- **Monitoring** : Prometheus scrape l'API avec succès (`health: up` sur
  la cible `mn3j-api`), Grafana a bien sa datasource Prometheus provisionnée.
- **Terraform** : `init`, `validate`, `plan`, `apply` (stack réellement
  créée et testée sur `http://localhost:4001`) et `destroy` passent tous.
- **Kubernetes** : validé en syntaxe uniquement (YAML) — pas de cluster
  disponible sur cette machine pour aller plus loin (voir `k8s/README.md`
  pour activer Kubernetes dans Docker Desktop ou installer minikube/k3d).

### Incidents rencontrés en cours de route (et comment ils ont été réglés)

1. **`npm ci` interrompu pendant le build Docker** (coupure réseau sur le
   téléchargement des binaires Prisma) — transitoire, résolu par un simple
   nouvel essai (`docker compose up --build`).
2. **Port 5432 déjà occupé** par un Postgres installé nativement sur la
   machine → `docker-compose.yml` utilise **5433** côté hôte pour ne pas y
   toucher (voir carte des ports ci-dessous).
3. **Traefik ne découvrait aucune route via les labels Docker**
   (`Error response from daemon: "..."` puis `API returned a 400`, testé
   avec Traefik v3.1 *et* v3.5, avec et sans variante d'API pinnée) : un
   vrai bug de compatibilité entre le client Docker interne de Traefik et
   cette version de Docker Desktop pour Windows — confirmé en montrant
   qu'un client Docker CLI standard, lui, dialogue sans problème avec le
   même socket monté. Contournement adopté : Traefik route maintenant via
   un **fichier de config statique** (`traefik/dynamic.yml`) plutôt que
   par découverte automatique des labels — même résultat, sans dépendre du
   socket Docker. Les labels `traefik.*` ont été retirés de
   `docker-compose.yml` en conséquence.

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
- **Traefik plutôt que Nginx** : conçu pour la découverte automatique des
  services (labels Docker), plus adapté à un environnement Compose/K8s qui
  évolue que des fichiers de config Nginx à maintenir à la main. Sur cette
  machine, la découverte via labels s'est heurtée à un bug de compatibilité
  avec Docker Desktop (voir "Incidents rencontrés") — Traefik route donc
  actuellement via un fichier statique (`traefik/dynamic.yml`), qui reste
  plus simple qu'une config Nginx équivalente et garde la même API/dashboard
  Traefik pour la suite.
- **GitHub Actions en priorité sur Jenkins** : déjà intégré à GitHub (où
  vit le repo), zéro infra à maintenir. Jenkins reste présent en parallèle
  comme exercice (self-hosted CI, très répandu en entreprise).
- **Kubernetes / Terraform en "optionnel"** : clairement surdimensionnés
  pour la taille actuelle du projet — leur intérêt ici est pédagogique,
  pas opérationnel.

## Note Windows / Git Bash

Si vous lancez des commandes `docker` contenant un chemin Unix commençant
par `/` (ex. `docker exec ... cat /var/jenkins_home/...`, ou un `-v
/var/run/docker.sock:...` en ligne de commande plutôt que dans un fichier
compose), Git Bash le convertit automatiquement en chemin Windows et casse
la commande. Préfixez alors avec `MSYS_NO_PATHCONV=1`, par exemple :
```bash
MSYS_NO_PATHCONV=1 docker compose -f jenkins/docker-compose.yml exec jenkins \
  cat /var/jenkins_home/secrets/initialAdminPassword
```
(Rencontré et contourné plusieurs fois pendant les tests ci-dessus.)

## Pour aller plus loin dans chaque chantier

- Backend / Docker / Compose : `server/README.md`
- Jenkins : `jenkins/README.md`
- Kubernetes : `k8s/README.md`
- Terraform : `terraform/README.md`
