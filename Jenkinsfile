pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        echo 'Building..'
        sh 'ls -a'
        sh 'pwd'
        sh 'npm i -g yarn'
        sh 'yarn install';
        sh 'yarn run build'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying...'
        sh 'cp -r dist/* /var/www/chat.d.ledev.ru/back/'
      }
    }
  }
}
