const dotenv = require('dotenv')
const { App, Stack } = require('@aws-cdk/core')
const SSM = require('./ssm-stack')
const Env = require('./env-stack')
const Cognito = require('./cognito-stack')
const GraphQL = require('./graphql-stack')

const app = new App({ autoSynth: true })
const envVars = dotenv.config().parsed
const config = {
  ...envVars,
  env: { account: envVars.CDK_AWS_ACCOUNT, region: envVars.CDK_AWS_REGION },
}

new SSM(app, `${config.CDK_STACK_NAME}-${config.CDK_STACK_ENV}-SSM`, { ...config })
const cognito = new Cognito(app, `${config.CDK_STACK_NAME}-${config.CDK_STACK_ENV}-Cognito`, { ...config })
const { graphQlApi, graphqlApiKey } = new GraphQL(app, `${config.CDK_STACK_NAME}-${config.CDK_STACK_ENV}-GraphQL`, {
  ...config,
  userPool: cognito.userPool,
})
new Env(app, `${config.CDK_STACK_NAME}-${config.CDK_STACK_ENV}-Env`, { ...config })
