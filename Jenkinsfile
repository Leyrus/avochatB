pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        echo 'Building..'
        sh 'ls -a'
        sh 'node -v'
        sh 'pwd'
        sh 'npm install';
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying...'
        sh 'npm run start:prod'
      }
    }
  }
}
