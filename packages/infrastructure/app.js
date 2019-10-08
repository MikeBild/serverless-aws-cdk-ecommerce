const dotenv = require('dotenv')
const { App } = require('@aws-cdk/core')
const E2ETests = require('./e2e-stack')
const Cognito = require('./cognito-stack')
const GraphQL = require('./graphql-stack')
const SalesApp = require('./sales-app-stack')
const ShopApp = require('./shop-app-stack')
const StorybookApp = require('./storybook-app-stack')

const app = new App({ autoSynth: true })
const config = { ...dotenv.config().parsed }

new E2ETests(app, `${config.STACK_NAME}-${config.STACK_ENV}-E2ETests`, { ...config })
new SalesApp(app, `${config.STACK_NAME}-${config.STACK_ENV}-SalesApp`, { ...config })
new ShopApp(app, `${config.STACK_NAME}-${config.STACK_ENV}-ShopApp`, { ...config })
new StorybookApp(app, `${config.STACK_NAME}-${config.STACK_ENV}-StorybookApp`, { ...config })
const { userPool } = new Cognito(app, `${config.STACK_NAME}-${config.STACK_ENV}-Cognito`, { ...config })
const { graphQlApi } = new GraphQL(app, `${config.STACK_NAME}-${config.STACK_ENV}-GraphQL`, { ...config, userPool })
