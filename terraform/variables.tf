variable "postgres_user" {
  type    = string
  default = "mn3j"
}

variable "postgres_password" {
  type      = string
  sensitive = true
  default   = "mn3j_dev_password"
}

variable "postgres_db" {
  type    = string
  default = "mn3j"
}

# Ports hôte volontairement différents de ceux de docker-compose.yml
# (5433/4000) pour pouvoir faire tourner les deux stacks en parallèle sans
# conflit si besoin.
variable "postgres_host_port" {
  type    = number
  default = 5434
}

variable "api_host_port" {
  type    = number
  default = 4001
}

variable "jwt_secret" {
  type      = string
  sensitive = true
  default   = "change-me-terraform-dev"
}

variable "admin_email" {
  type    = string
  default = "admin@mn3jgroup.com"
}

variable "admin_password" {
  type      = string
  sensitive = true
  default   = "change-me-terraform-dev"
}
