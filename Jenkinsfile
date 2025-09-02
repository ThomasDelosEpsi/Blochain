pipeline {
  agent {
    docker { image 'node:20' }
  }

  options {
    skipDefaultCheckout(true)
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
        sh 'npm ci --no-optional || npm install --no-optional'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Compile') {
      steps {
        sh 'node compile.js'
      }
    }

    stage('Test + Coverage') {
      steps {
        sh 'npm run ci-coverage'
      }
      post {
        always {
          junit 'test-results/results.xml'

          // --- Nouveau: Coverage Plugin ---
          // Pour les rapports Cobertura générés par nyc :
          script {
            try {
              // si tu as le plugin Coverage (recommandé)
              recordCoverage(
                tools: [
                  // l’un OU l’autre marche selon ta version de plugin :
                  istanbulCobertura(pattern: 'coverage/cobertura-coverage.xml')
                  // ou bien: cobertura(pattern: 'coverage/cobertura-coverage.xml')
                ],
                sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
              )
            } catch (e) {
              echo "Coverage non publiée (plugin/step indisponible) : ${e}"
            }
          }
          // --------------------------------

          archiveArtifacts artifacts: 'coverage/**, test-results/*.xml, build/*.abi, build/*.bin, audit.json', fingerprint: true
        }
      }
    }

    stage('Audit npm (non bloquant)') {
      steps { sh 'npm run audit:ci' }
    }
  }
}
