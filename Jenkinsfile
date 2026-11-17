pipeline {
    agent any

    environment {
        IMAGE_NAME = 'largest-of-three'
        IMAGE_TAG  = 'latest'
        // Jenkins on Mac (brew) may not have Docker/kubectl in PATH:
        PATH = "/usr/local/bin:/opt/homebrew/bin:/Applications/Docker.app/Contents/Resources/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Run Unit Tests') {
            steps { sh 'node --version && npm test' }
        }
        stage('Build Docker Image') {
            steps { sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .' }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
                sh 'kubectl rollout restart deployment/largest-app'
            }
        }
        stage('Verify Deployment') {
            steps {
                sh 'kubectl rollout status deployment/largest-app --timeout=90s'
                sh 'kubectl get pods,svc'
            }
        }
    }
    post {
        success { echo 'Pipeline SUCCESS - app available at http://localhost:30080' }
        failure { echo 'Pipeline FAILED - check Console Output' }
    }
}
