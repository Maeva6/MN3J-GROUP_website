# Kubernetes (exercice DevOps, optionnel)

Manifests d'apprentissage pour déployer l'API sur un cluster Kubernetes.
**Pas nécessaire au fonctionnement du site** (Docker Compose suffit très
largement à ce stade) — utile si vous voulez pousser l'exploration DevOps
au-delà d'un seul serveur.

⚠️ Ces fichiers ont été validés uniquement en syntaxe YAML (`yaml-lint`).
Le `kubectl` de cette machine n'a pas de cluster à contacter, donc pas de
`kubectl apply --dry-run=client` possible tant qu'aucun cluster n'est
configuré — voir "Avoir un cluster" ci-dessous.

## Avoir un cluster pour tester

Le plus simple si Docker Desktop est déjà installé : **Settings → Kubernetes
→ Enable Kubernetes**. Alternative : [minikube](https://minikube.sigs.k8s.io/)
ou [k3d](https://k3d.io/).

Un ingress controller est aussi nécessaire pour `ingress.yaml` :
```bash
minikube addons enable ingress
# ou, avec Docker Desktop Kubernetes / k3d : installer ingress-nginx via Helm
```

## Déployer

```bash
# 1. Config + secrets
kubectl apply -f k8s/namespace.yaml
cp k8s/secret.example.yaml k8s/secret.yaml   # puis éditez les valeurs
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml

# 2. Base de données, puis API (attendre que Postgres soit prêt)
kubectl apply -f k8s/postgres.yaml
kubectl -n mn3j-group rollout status deployment/postgres
kubectl apply -f k8s/api.yaml

# 3. Migrations (l'entrypoint Docker les gère au démarrage du conteneur,
#    donc rien à faire de plus — vérifiez juste les logs)
kubectl -n mn3j-group logs -l app=api

# 4. Ingress
kubectl apply -f k8s/ingress.yaml
```

Ou tout en une fois avec Kustomize (sauf le secret, volontairement à part) :
```bash
kubectl apply -k k8s/
```

## Accéder à l'API

Ajoutez `api.mn3j.local` à votre fichier hosts, pointant vers l'IP du
cluster (`minikube ip`, ou `127.0.0.1` avec Docker Desktop Kubernetes),
puis :

```bash
curl http://api.mn3j.local/api/health
```

## Image utilisée

`k8s/api.yaml` référence `ghcr.io/maeva6/mn3j-group-api:latest`, publiée
par `.github/workflows/backend-ci.yml` à chaque push sur `main`. Il faut
donc avoir poussé le code une première fois (voir le workflow) pour que
cette image existe.

## Nettoyer

```bash
kubectl delete namespace mn3j-group
```
