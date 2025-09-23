pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Building Spring Boot backend...'
                bat 'cd backend && .\\mvnw.cmd clean package -DskipTests'
            }
        }

        stage('Run Backend') {
            steps {
                echo 'Starting backend on port 8085...'
                bat 'start /B java -jar backend\\target\\backend-0.0.1-SNAPSHOT.jar --server.port=8085'
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Cleaning and installing frontend dependencies...'
                bat 'cd agri-oasis-market && rmdir /S /Q node_modules || echo "No node_modules to delete"'
                bat 'cd agri-oasis-market && if exist package-lock.json del package-lock.json'
                bat 'cd agri-oasis-market && npm install --legacy-peer-deps'

                echo 'Building React frontend...'
                bat 'cd agri-oasis-market && npm run build'
            }
        }

        stage('Serve Frontend') {
            steps {
                echo 'Starting frontend on port 3000...'
                bat 'cd agri-oasis-market && start /B npx serve -s build -l 3000'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '✅ Deployment complete!'
                echo 'Backend running at: http://localhost:8085'
                echo 'Frontend running at: http://localhost:3000'
            }
        }
    }
}
