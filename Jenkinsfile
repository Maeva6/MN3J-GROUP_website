// Pipeline miroir de .github/workflows/backend-ci.yml, en Jenkins.
// Sert d'exercice d'apprentissage : deux outils de CI différents pour le
// même besoin. Nécessite le plugin "Docker Pipeline" (voir jenkins/plugins.txt).

pipeline {
  agent any

  environment {
    IMAGE_NAME = "mn3j-group-api"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Lint') {
      agent {
        docker {
          image 'node:20-alpine'
          args '-u root'
          reuseNode true
        }
      }
      steps {
        dir('server') {
          sh 'npm ci'
          sh 'npm run lint'
        }
      }
    }

    stage('Prisma generate') {
      agent {
        docker {
          image 'node:20-alpine'
          args '-u root'
          reuseNode true
        }
      }
      steps {
        dir('server') {
          sh 'npx prisma generate'
        }
      }
    }

    stage('Test') {
      agent {
        docker {
          image 'node:20-alpine'
          args '-u root'
          reuseNode true
        }
      }
      steps {
        dir('server') {
          sh 'npm test'
        }
      }
    }

    stage('Build Docker image') {
      steps {
        dir('server') {
          sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
        }
      }
    }
  }

  post {
    success {
      echo "✓ Build #${BUILD_NUMBER} réussi — image ${IMAGE_NAME}:${BUILD_NUMBER} construite."
    }
    failure {
      echo "✗ Build #${BUILD_NUMBER} en échec."
    }
  }
}
