pipeline {
  agent {
    docker { image 'node:20' }
  }
  options {
    timestamps()
  }
  stages {
    stage('Install') {
      steps {
        dir('Blockchain') {
          sh 'npm ci || npm install'
        }
      }
    }
    stage('Compile') {
      steps {
        dir('Blockchain') {
          sh 'node compile.js'
        }
      }
    }
    stage('Test (Mocha -> JUnit)') {
      steps {
        dir('Blockchain') {
          sh 'npm run ci-test'
        }
      }
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