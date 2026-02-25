pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:24-dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-graph-storage
      mountPath: /var/lib/docker
  - name: builder
    image: docker:24-cli
    command:
    - cat
    tty: true
    env:
    - name: DOCKER_HOST
      value: tcp://localhost:2375
  - name: kubectl
  image: lachlanevenson/k8s-kubectl:latest
  command:
  - cat
  tty: true
  volumes:
  - name: docker-graph-storage
    emptyDir: {}
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
    DEPLOYMENT_NAME = "frontend-ithaka"
    CONTAINER_NAME  = "frontend-ithaka"
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

    stage('Build & Push image') {
      steps {
        container('builder') {
          withCredentials([usernamePassword(
            credentialsId: env.CREDENTIALS_ID,
            usernameVariable: 'REG_USER',
            passwordVariable: 'REG_PASS'
          )]) {
            sh """
docker login -u ${REG_USER} -p ${REG_PASS}
docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} \
  -f ${APP_WORKSPACE}/infra/Dockerfile \
  ${APP_WORKSPACE}
docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
docker logout
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
