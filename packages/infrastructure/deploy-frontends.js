const dotenv = require('dotenv')
const { App } = require('@aws-cdk/core')
const Env = require('./env-stack')
const E2ETests = require('./e2e-stack')
const SalesApp = require('./sales-app-stack')
const ShopApp = require('./shop-app-stack')
const StorybookApp = require('./storybook-app-stack')

const app = new App({ autoSynth: true })
const envVars = dotenv.config().parsed
const config = {
  ...envVars,
  env: { account: envVars.CDK_AWS_ACCOUNT, region: envVars.CDK_AWS_REGION },
}

new Env(app, `${config.CDK_STACK_NAME}-${config.CDK_STACK_ENV}-Env`, { ...config })
new E2ETests(app, `${config.CDL_STACK_NAME}-${config.CDK_STACK_ENV}-E2ETests`, { ...config })
new SalesApp(app, `${config.CDL_STACK_NAME}-${config.CDK_STACK_ENV}-SalesApp`, { ...config })
new ShopApp(app, `${config.CDL_STACK_NAME}-${config.CDK_STACK_ENV}-ShopApp`, { ...config })
new StorybookApp(app, `${config.CDL_STACK_NAME}-${config.CDK_STACK_ENV}-StorybookApp`, { ...config })
