pipeline {
    agent none
    options {
        checkoutToSubdirectory('pcc-ui')
        newContainerPerStage()
    }
    environment {
        PROJECT_DIR='pcc-ui'
    }
    stages {
        stage ('Build and Deploy pcc-ui') {
            agent {
                docker {
                    image 'node:lts-buster'
                }
            }
            steps {
                echo 'Build ams-admin-ui'
                withCredentials([file(credentialsId: 'pcc-ui-conf', variable: 'PCC_UI_CONF')]) {
                    sh '''
                        cd $WORKSPACE/$PROJECT_DIR
                        rm ./src/config.js
                        cp $AMS_ADMIN_CONF ./src/
                        npm install
                        npm run build
                    '''
                }
                script {
                    if ( env.BRANCH_NAME == 'devel' ) {
                        sshagent (credentials: ['newgrnetci-pcc-ui']) {
                            sh '''
                                cd $WORKSPACE/$PROJECT_DIR
                                ssh -o "StrictHostKeyChecking no" root@pcc.devel.argo.grnet.gr rm -rf /var/www/pcc.devel.argo.grnet.gr/*
                                scp -o "StrictHostKeyChecking no" -r  build/* root@pcc.devel.argo.grnet.gr:/var/www/pcc.devel.argo.grnet.gr/
                            '''
                        }
                    }
                }
            }
        }
    }
    post {
        success {
            script{
                if ( env.BRANCH_NAME == 'devel' ) {
                    slackSend( message: ":rocket: New version for <$BUILD_URL|$PROJECT_DIR>:$BRANCH_NAME Job: $JOB_NAME !")
                    slackSend( message: ":satellite: New version of <$BUILD_URL|$PROJECT_DIR> Deployed successfully to devel!")
                }
                else if ( env.BRANCH_NAME == 'master' ) {
                    slackSend( message: ":rocket: New version for <$BUILD_URL|$PROJECT_DIR>:$BRANCH_NAME Job: $JOB_NAME !")
                }
            }
        }
        failure {
            script{
                if ( env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'devel' ) {
                    slackSend( message: ":rain_cloud: Build Failed for <$BUILD_URL|$PROJECT_DIR>:$BRANCH_NAME Job: $JOB_NAME")
                }
            }
        }
    }
}
