const dotenv = require('dotenv')
const { App, Stack } = require('@aws-cdk/core')
const SSM = require('./ssm-stack')

const stackEnv = process.env.CDK_STACK_ENV

if (!stackEnv) {
  console.error(`CDK_STACK_ENV environment variable is missing.`)
  process.exit(1)
}

const app = new App({ autoSynth: true })
const envVars = { ...dotenv.config({ path: `.env.${stackEnv}` }).parsed }
const config = {
  ...envVars,
  env: { account: envVars.CDK_AWS_ACCOUNT, region: envVars.CDK_AWS_REGION },
}

new SSM(app, `${config.CDK_STACK_NAME}-${config.CDK_STACK_ENV}-SSM`, { ...config })
