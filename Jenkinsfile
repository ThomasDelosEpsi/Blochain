pipeline {
  // on peut garder docker { image 'node:20' } si Docker marche chez toi,
  // sinon remplace par: agent any
  agent {
    docker { image 'node:20' }
  }

  options {
    skipDefaultCheckout(true)        // <-- évite "Declarative: Checkout SCM"
    timestamps()
    timeout(time: 10, unit: 'MINUTES')
  }

  environment { TZ = 'Europe/Paris'; CI = 'true' }

  stages {
    stage('Checkout') {
      steps {
        deleteDir()                  // workspace propre
        git branch: 'main',
            url: 'https://github.com/ThomasDelosEpsi/Blochain.git',
            credentialsId: 'github-pat-main'
      }
    }

    stage('Install')   { steps { dir('Blockchain') { sh 'npm ci || npm install' } } }
    stage('Compile')   { steps { dir('Blockchain') { sh 'node compile.js' } } }
    stage('Test (Mocha → JUnit)') {
      steps { dir('Blockchain') { sh 'npm run ci-test' } }
      post {
        always {
          dir('Blockchain') {
            junit 'test-results/results.xml'
            archiveArtifacts artifacts: 'test-results/*.xml, build/*.abi, build/*.bin', fingerprint: true
          }
        }
      }
    }
  }
}
