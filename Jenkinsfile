pipeline {
  agent {
    docker { image 'node:20' }
  }

  options {
    skipDefaultCheckout(true)        // on gère le checkout nous-mêmes
    timestamps()
    timeout(time: 10, unit: 'MINUTES')
  }

  environment { TZ = 'Europe/Paris'; CI = 'true' }

  stages {
    stage('Checkout') {
      steps {
        deleteDir()
        git branch: 'main',
            url: 'https://github.com/ThomasDelosEpsi/Blochain.git',
            credentialsId: 'github-pat-main'
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci || npm install'
      }
    }

    stage('Compile') {
      steps {
        sh 'node compile.js'
      }
    }

    stage('Test (Mocha → JUnit)') {
      steps {
        sh 'npm run ci-test'
      }
      post {
        always {
          junit 'test-results/results.xml'
          archiveArtifacts artifacts: 'test-results/*.xml, build/*.abi, build/*.bin', fingerprint: true
        }
      }
    }
  }
}
