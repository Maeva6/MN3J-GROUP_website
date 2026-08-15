output "api_url" {
  description = "URL locale de l'API provisionnée par Terraform"
  value       = "http://localhost:${var.api_host_port}"
}

output "postgres_connection" {
  description = "Chaîne de connexion Postgres (accès direct depuis l'hôte)"
  value       = "postgresql://${var.postgres_user}:${var.postgres_password}@localhost:${var.postgres_host_port}/${var.postgres_db}"
  sensitive   = true
}
