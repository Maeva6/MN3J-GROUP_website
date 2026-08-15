# Exercice DevOps : provisionner la même stack locale que docker-compose.yml,
# mais de façon déclarative avec Terraform (provider "docker" — pas de cloud
# ni de facturation, tout tourne toujours en local).
#
# Le but pédagogique : le jour où l'API sera déployée pour de vrai, on
# remplace juste le bloc `provider` et les types de resource (ex. aws_ecs_*,
# google_cloud_run_*…) — la structure (variables, outputs, dépendances entre
# ressources) reste la même.

terraform {
  required_version = ">= 1.5"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_network" "mn3j" {
  name = "mn3j-group-tf-network"
}

resource "docker_volume" "pgdata" {
  name = "mn3j-group-tf-pgdata"
}

resource "docker_image" "postgres" {
  name = "postgres:16-alpine"
}

resource "docker_container" "db" {
  name  = "mn3j-tf-db"
  image = docker_image.postgres.image_id

  networks_advanced {
    name = docker_network.mn3j.name
  }

  env = [
    "POSTGRES_USER=${var.postgres_user}",
    "POSTGRES_PASSWORD=${var.postgres_password}",
    "POSTGRES_DB=${var.postgres_db}",
  ]

  ports {
    internal = 5432
    external = var.postgres_host_port
  }

  volumes {
    volume_name    = docker_volume.pgdata.name
    container_path = "/var/lib/postgresql/data"
  }

  healthcheck {
    test     = ["CMD-SHELL", "pg_isready -U ${var.postgres_user}"]
    interval = "5s"
    timeout  = "5s"
    retries  = 10
  }
}

# Construit l'image à partir du même Dockerfile que docker-compose.yml et la CI.
resource "docker_image" "api" {
  name = "mn3j-group-api-tf:latest"
  build {
    context = "${path.module}/../server"
  }
}

resource "docker_container" "api" {
  name  = "mn3j-tf-api"
  image = docker_image.api.image_id

  networks_advanced {
    name = docker_network.mn3j.name
  }

  env = [
    "DATABASE_URL=postgresql://${var.postgres_user}:${var.postgres_password}@${docker_container.db.name}:5432/${var.postgres_db}?schema=public",
    "PORT=4000",
    "JWT_SECRET=${var.jwt_secret}",
    "JWT_EXPIRES_IN=8h",
    "ADMIN_EMAIL=${var.admin_email}",
    "ADMIN_PASSWORD=${var.admin_password}",
    "CORS_ORIGIN=http://localhost:5173",
    "SEED_ON_START=true",
  ]

  ports {
    internal = 4000
    external = var.api_host_port
  }

  depends_on = [docker_container.db]
}
