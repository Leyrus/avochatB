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
        sh 'npm run start:prod'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying...'
//         sh 'cp -r dist/* /var/www/chat.d.ledev.ru/back/'
      }
    }
  }
}
