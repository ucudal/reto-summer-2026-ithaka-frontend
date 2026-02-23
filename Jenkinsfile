pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    command:
    - cat
    tty: true
    volumeMounts:
      - name: kanikodir
        mountPath: /kaniko/.docker
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
  volumes:
    - name: kanikodir
      emptyDir: {}
"""
    }
  }

  environment {
    REGISTRY = "docker.io/martinc813"         
    IMAGE_NAME = "ithaka-frontend-martin"
    CREDENTIALS_ID = "registry-credentials"   
    NAMESPACE = "ticket-platform"             
    DEPLOYMENT_NAME = "mi-app-deployment"     
    CONTAINER_NAME = "mi-app"                  
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        container('kaniko') {
          script {
            // TAG: usaremos commit short + build number para trazabilidad
            env.GIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
            env.IMAGE_TAG = "${env.GIT_SHORT}-${env.BUILD_NUMBER}"
            echo "Image tag: ${env.IMAGE_TAG}"
          }
        }
      }
    }

    stage('Build & Push image (Kaniko)') {
      steps {
        container('kaniko') {
          // Crear archivo de credenciales Docker usando las credenciales guardadas en Jenkins
          withCredentials([usernamePassword(credentialsId: env.CREDENTIALS_ID, usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
            sh '''
set -e
mkdir -p /kaniko/.docker
cat > /kaniko/.docker/config.json <<EOF
{
  "auths": {
    "${REGISTRY}": {
      "username": "${REG_USER}",
      "password": "${REG_PASS}"
    }
  }
}
EOF
'''
            // Ejecutar Kaniko: construye y pushea la imagen
            sh """
/kaniko/executor \
  --context=${WORKSPACE} \
  --dockerfile=${WORKSPACE}/Dockerfile \
  --destination=${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} \
  --cache=true
"""
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        container('kubectl') {
          // Actualiza el deployment a la nueva imagen y espera rollout
          sh "kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} -n ${NAMESPACE}"
          sh "kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE} --timeout=120s"
        }
      }
    }
  }

  post {
    success {
      echo "Deploy exitoso: ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    }
    failure {
      echo "Algo falló en el pipeline."
    }
  }
}
