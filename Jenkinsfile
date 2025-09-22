pipeline {
    agent any

    environment {
        JAVA_HOME = "C:\\Program Files\\Java\\jdk-21"
        PATH = "${env.JAVA_HOME}\\bin;${env.PATH}"
        BACKEND_PORT = "8085"
        FRONTEND_PORT = "5173"
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
                bat 'cd backend && mvnw.cmd clean package -DskipTests'
            }
        }

        stage('Run Backend') {
            steps {
                echo 'Starting backend on port 8085...'
                // Find the JAR file and run it
                bat '''
                cd backend
                for %%f in (target\\*.jar) do (
                    set JARNAME=%%f
                    echo Running backend jar %%f
                    start cmd /k "java -jar %%f --server.port=%BACKEND_PORT%"
                )
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building React frontend...'
                bat 'cd agri-oasis-market && npm install && npm run build'
            }
        }

        stage('Run Frontend') {
            steps {
                echo 'Starting frontend on port 5173...'
                bat "start cmd /k \"cd agri-oasis-market && npm run dev -- --port ${FRONTEND_PORT}\""
            }
        }
    }
}
