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
                echo 'Build pcc-ui'
                    sh '''
                        cd $WORKSPACE/$PROJECT_DIR
                        rm ./src/config.js
                        cp $AMS_ADMIN_CONF ./src/
                        npm install
                        npm run build
                    '''
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
