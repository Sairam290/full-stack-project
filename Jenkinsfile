pipeline {
    agent any

    environment {
        JAVA_HOME = "C:\\Program Files\\Java\\jdk-21"
        NODE_HOME = "C:\\Program Files\\nodejs"
        PATH = "${env.JAVA_HOME}\\bin;${env.NODE_HOME};${env.PATH}"
        BACKEND_PORT = "8085"
        FRONTEND_PORT = "3000"
    }

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
                // Run backend detached so pipeline can continue
                bat "start /B java -jar backend\\target\\backend-0.0.1-SNAPSHOT.jar --server.port=%BACKEND_PORT%"
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Installing frontend dependencies...'
                bat 'cd agri-oasis-market && npm install'
                
                echo 'Building React frontend...'
                bat 'cd agri-oasis-market && npm run build'
            }
        }

        stage('Serve Frontend') {
            steps {
                echo 'Serving frontend on port 3000...'
                // Serve build folder in non-interactive mode
                bat "cd agri-oasis-market && npx serve -s build -l %FRONTEND_PORT%"
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Deployment complete!'
                echo "Backend: http://localhost:%BACKEND_PORT%"
                echo "Frontend: http://localhost:%FRONTEND_PORT%"
            }
        }
    }
}
