# Jenkins + CLI Docker (pattern "Docker-outside-of-Docker" : Jenkins pilote
# le Docker de l'hôte via le socket monté dans docker-compose.yml, plutôt
# que de faire tourner un daemon Docker imbriqué).
FROM jenkins/jenkins:lts-jdk17

USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends docker.io \
  && rm -rf /var/lib/apt/lists/*

COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

USER jenkins
