const dotenv = require('dotenv')
const { App } = require('@aws-cdk/core')
const Configs = require('./configs-stack')
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

const { configs } = new Configs(app, `${config.CDK_STACK_NAME}-${config.CDK_STACK_ENV}-Configs`, { ...config })
new E2ETests(app, `${config.CDL_STACK_NAME}-${config.CDK_STACK_ENV}-E2ETests`, { ...config, ...configs })
new SalesApp(app, `${config.CDL_STACK_NAME}-${config.CDK_STACK_ENV}-SalesApp`, { ...config, ...configs })
new ShopApp(app, `${config.CDL_STACK_NAME}-${config.CDK_STACK_ENV}-ShopApp`, { ...config, ...configs })
new StorybookApp(app, `${config.CDL_STACK_NAME}-${config.CDK_STACK_ENV}-StorybookApp`, { ...config, ...configs })
