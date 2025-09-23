pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
        FRONTEND_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Sairam290/fullstack-app.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo 'Building backend using Maven Wrapper...'
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Start Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo 'Stopping previous backend processes (if any)...'
                    bat '''
                    for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq java.exe" /FO LIST ^| findstr /I "backend"') do taskkill /PID %%i /F
                    '''
                    echo 'Starting backend...'
                    bat 'for %%f in (target\\*.jar) do set JAR_FILE=%%f & start /B java -jar %JAR_FILE%'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo 'Installing frontend dependencies...'
                    bat 'npm install'
                    echo 'Building frontend...'
                    bat 'npm run build'
                }
            }
        }

        stage('Serve Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo 'Stopping previous frontend processes (if any)...'
                    bat '''
                    for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq node.exe" /FO LIST ^| findstr /I "frontend"') do taskkill /PID %%i /F
                    '''
                    echo 'Serving frontend...'
                    bat "start /B npx serve -s build -l %FRONTEND_PORT%"
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'CI/CD pipeline failed!'
        }
    }
}
