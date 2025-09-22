pipeline {
    agent any

    environment {
        JAVA_HOME = "C:\\Program Files\\Java\\jdk-21"
        NODE_HOME = "C:\\Program Files\\nodejs"
        PATH = "${env.JAVA_HOME}\\bin;${env.NODE_HOME};${env.PATH}"
        BACKEND_PORT = "8085"
        FRONTEND_PORT = "3000"
        MAVEN_LOCAL_REPO = "C:\\Users\\${env.USERNAME}\\.m2\\repository"
        NPM_CACHE = "C:\\Users\\${env.USERNAME}\\AppData\\Roaming\\npm-cache"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build Backend & Frontend in Parallel') {
            parallel {
                stage('Build Backend') {
                    steps {
                        echo 'Building Spring Boot backend...'
                        bat "cd backend && .\\mvnw.cmd clean package -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                    }
                }

                stage('Build Frontend') {
                    steps {
                        echo 'Installing frontend dependencies...'
                        bat "cd agri-oasis-market && npm ci --cache %NPM_CACHE%"
                        
                        echo 'Building React frontend...'
                        bat "cd agri-oasis-market && npm run build"
                    }
                }
            }
        }

        stage('Serve Backend & Frontend') {
            steps {
                echo 'Starting backend and serving frontend...'
                // Run backend detached
                bat "start /B java -jar backend\\target\\backend-0.0.1-SNAPSHOT.jar --server.port=%BACKEND_PORT%"
                
                // Serve frontend detached
                bat "start /B cmd /c cd agri-oasis-market && npx serve -s build -l %FRONTEND_PORT%"
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Deployment complete!'
                echo "Backend URL: http://localhost:%BACKEND_PORT%"
                echo "Frontend URL: http://localhost:%FRONTEND_PORT%"
            }
        }

        stage('Cleanup (Optional)') {
            steps {
                echo 'Stopping backend and frontend processes...'
                // Stops backend and frontend processes to free ports for next build
                bat 'taskkill /F /IM java.exe /T'
                bat 'taskkill /F /IM node.exe /T'
            }
        }
    }
}
