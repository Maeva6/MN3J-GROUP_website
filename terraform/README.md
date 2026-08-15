# Terraform (exercice DevOps, optionnel)

Provisionne exactement la même stack locale (réseau + Postgres + API) que
`docker-compose.yml`, mais de façon déclarative. **Pas nécessaire au
fonctionnement du site** — c'est l'exercice "Infrastructure as Code" de la
liste des 6 outils.

Aucun cloud ni facturation : le provider utilisé est
[`kreuzwerker/docker`](https://registry.terraform.io/providers/kreuzwerker/docker/latest),
qui pilote le Docker local exactement comme `docker compose` le ferait.

## Installer Terraform

```powershell
winget install HashiCorp.Terraform
```

## Utiliser

```bash
cd terraform
terraform init      # télécharge le provider docker
terraform plan       # montre ce qui serait créé
terraform apply       # crée réseau + conteneur Postgres + build & lance l'API
```

Une fois appliqué :
```bash
terraform output api_url
curl $(terraform output -raw api_url)/api/health
```

Pour tout supprimer :
```bash
terraform destroy
```

## Pourquoi les ports sont différents de `docker-compose.yml`

`docker-compose.yml` utilise déjà 5433 (Postgres) et 4000 (API, via
Traefik sur le port 80). Ce module Terraform utilise 5434 et 4001 par
défaut (voir `variables.tf`) pour pouvoir tourner en parallèle sans
conflit, le temps de comparer les deux approches.

## Aller plus loin : un vrai cloud

Pour déployer sur un vrai fournisseur plus tard, la structure ne change
pas — seuls changent :
- le bloc `provider` (ex. `aws`, `google`, `azurerm` à la place de `docker`)
- les types de resource (ex. `aws_ecs_service` + `aws_rds_instance` à la
  place de `docker_container` + une image Postgres locale)

Les fichiers `variables.tf` / `outputs.tf` gardent le même rôle et peuvent
rester quasiment inchangés.
