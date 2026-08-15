# Jenkins (exercice DevOps local)

Jenkins ici n'est **pas nécessaire au fonctionnement du site** — c'est un
second outil de CI, en plus de GitHub Actions (`.github/workflows/backend-ci.yml`),
pour comparer les deux approches (SaaS géré vs self-hosted) sur le même pipeline.

## Démarrer

```bash
docker compose -f jenkins/docker-compose.yml up --build -d
```

Premier démarrage : Jenkins installe les plugins listés dans `plugins.txt`,
ça peut prendre 1-2 minutes. Suivre les logs :

```bash
docker compose -f jenkins/docker-compose.yml logs -f jenkins
```

## Récupérer le mot de passe admin initial

```bash
docker compose -f jenkins/docker-compose.yml exec jenkins \
  cat /var/jenkins_home/secrets/initialAdminPassword
```

Puis ouvrir http://localhost:8090, coller le mot de passe, et choisir
"Install suggested plugins" (les plugins de `plugins.txt` sont déjà là,
celui-ci en ajoute d'autres utiles par défaut).

## Créer le pipeline

1. **New Item** → nom `mn3j-group-backend` → type **Pipeline** → OK
2. Dans la config du job, section **Pipeline** :
   - Definition : `Pipeline script from SCM`
   - SCM : `Git`
   - Repository URL : l'URL de votre dépôt GitHub (une fois poussé) —
     ou, pour tester sans dépendre de GitHub, le chemin local monté dans
     le conteneur (voir note ci-dessous)
   - Script Path : `Jenkinsfile` (déjà à la racine du repo)
3. **Save**, puis **Build Now**

Le pipeline exécute : install + lint → `prisma generate` → tests → build
de l'image Docker (mêmes étapes que le workflow GitHub Actions).

## Tester en local sans pousser sur GitHub

Pour itérer sans dépendre d'un push GitHub à chaque essai, vous pouvez
committer localement puis pointer Jenkins sur le dépôt local en le
montant dans le conteneur : ajoutez un volume dans
`jenkins/docker-compose.yml` (ex. `- ..:/workspace:ro`) et utilisez
`file:///workspace` comme Repository URL. À enlever une fois le vrai
dépôt GitHub utilisé.

## Nettoyer

```bash
docker compose -f jenkins/docker-compose.yml down -v
```

(`-v` supprime aussi le volume `jenkins_home`, donc toute la config Jenkins —
utile pour repartir de zéro.)
