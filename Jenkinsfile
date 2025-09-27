pipeline {
    agent any

    environment {
        // Your Docker Hub username. Replace 'sairam290' with your actual username.
        DOCKER_REGISTRY = 'sairam290'
    }

    stages {
        stage('Deploy Locally') {
            steps {
                echo 'Pulling the latest Docker images from Docker Hub...'
                // Pulls the backend image from Docker Hub.
                ps "docker pull ${DOCKER_REGISTRY}/cicdfullstackprojects-backend:latest"
                // Pulls the frontend image from Docker Hub.
                ps "docker pull ${DOCKER_REGISTRY}/cicdfullstackprojects-frontend:latest"
                
                echo 'Starting containers with Docker Compose...'
                // Runs docker-compose using the specified YAML file.
                // IMPORTANT: Replace 'C:\\path\\to\\your\\docker-compose.yml' with the actual path.
                // Use double backslashes for the path in the Groovy string.
                ps "C:\\Program Files (x86)\\Jenkins\\workspace\\My-App-CI-CD-Pipeline\\docker-compose.yml' up -d --force-recreate"
            }
        }
    }
    
    post {
        always {
            // Cleans up the Jenkins workspace to save disk space after the job is done.
            cleanWs()
        }
    }
}