pipeline {
  environment {
      namespace =  env.BRANCH_NAME.toLowerCase()
  }
     agent any
           
      stages {
        stage('CheckOut') {            
            steps { checkout scm }            
        }
    
        
        stage('Build') {
          when { anyOf { branch 'desenvolvimento'; branch 'homolog'; branch "prod"; } }
          steps {
            script{                               
                    dir("node-project") {
                        dockerImage = docker.build "localhost:32000/portalapp:${env.namespace}"
                            dockerImage.push()                                                      
                    }
                }
          }
        }
            
       
        stage('Deploy'){
            when { anyOf { branch 'desenvolvimento'; branch 'homolog'; branch "prod"; } } 
                steps {
            script{ 
                 sh "microk8s kubectl rollout restart deployment/deploy-portalapp -n ${env.namespace}" 
            }
          }
        } 
      }
}