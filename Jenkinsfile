pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
    - cat
    tty: true
    resources:
      requests:
        cpu: "500m"
        memory: "1Gi"
        ephemeral-storage: "10Gi"
      limits:
        cpu: "1"
        memory: "2Gi"
        ephemeral-storage: "15Gi"
    volumeMounts:
      - name: kanikodir
        mountPath: /kaniko/.docker
  - name: kubectl
    image: lachlanevenson/k8s-kubectl:latest
    command:
    - cat
    tty: true
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
  volumes:
    - name: kanikodir
      emptyDir:
        sizeLimit: "15Gi"
"""
    }
  }

  environment {
    REGISTRY        = "docker.io/martinc813"
    IMAGE_NAME      = "ithaka-frontend-martin"
    CREDENTIALS_ID  = "registry-credentials"
    INFRA_REPO_URL  = "https://github.com/ucudal/reto-summer-2026-ithaka-frontend-infra"
    INFRA_REPO_CRED_ID = ""
    NAMESPACE       = "ticket-platform"
    DEPLOYMENT_NAME = "ithaka-frontend"
    CONTAINER_NAME  = "ithaka-frontend"
  }

  triggers {
    githubPush()
  }

  stages {

    stage('Checkout APP') {
      steps {
        checkout scm
      }
    }

    stage('Prepare') {
      steps {
        script {
          env.GIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          env.IMAGE_TAG = "${env.GIT_SHORT}-${env.BUILD_NUMBER}"
          env.APP_WORKSPACE = "${WORKSPACE}"
          echo "Image tag: ${env.IMAGE_TAG}"
          echo "App workspace: ${env.APP_WORKSPACE}"
        }
      }
    }

    stage('Checkout INFRA repo') {
      steps {
        dir('infra') {
          script {
            if (env.INFRA_REPO_CRED_ID?.trim()) {
              git url: env.INFRA_REPO_URL, credentialsId: env.INFRA_REPO_CRED_ID, branch: 'main'
            } else {
              git url: env.INFRA_REPO_URL, branch: 'main'
            }
          }
        }
      }
    }

    stage('Build & Push image (Kaniko)') {
      steps {
        container('kaniko') {
          withCredentials([usernamePassword(
            credentialsId: env.CREDENTIALS_ID,
            usernameVariable: 'REG_USER',
            passwordVariable: 'REG_PASS'
          )]) {
            sh """
set -e
mkdir -p /kaniko/.docker
cat > /kaniko/.docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "${REG_USER}",
      "password": "${REG_PASS}"
    }
  }
}
EOF
"""
            sh """
/kaniko/executor \\
  --context=${APP_WORKSPACE} \\
  --dockerfile=${APP_WORKSPACE}/infra/Dockerfile \\
  --destination=docker.io/martinc813/${IMAGE_NAME}:${IMAGE_TAG} \\
  --cache=true \\
  --single-snapshot
"""
          }
        }
      }
    }

    stage('Apply infra manifests') {
      steps {
        container('kubectl') {
          sh "kubectl apply -f ${APP_WORKSPACE}/infra/k8s/ -n ${NAMESPACE}"
        }
      }
    }

    stage('Update image & rollout') {
      steps {
        container('kubectl') {
          sh "kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} -n ${NAMESPACE}"
          sh "kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE} --timeout=180s"
        }
      }
    }

  }

  post {
    success {
      echo "✅ Deploy exitoso: ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} → ns: ${NAMESPACE}"
    }
    failure {
      echo "❌ Pipeline falló - revisá los logs"
    }
  }
}
