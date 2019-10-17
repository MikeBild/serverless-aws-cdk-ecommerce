const { join } = require('path')
const { Stack, Duration } = require('@aws-cdk/core')
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda')

module.exports = class E2ETests extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const {
      CDK_STACK_NAME,
      CDK_STACK_ENV,
      CDK_E2E_BASE_URL,
      CDK_E2E_USERNAME,
      CDK_E2E_PASSWORD,
      CDK_AWS_REGION,
    } = props

    new Function(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-E2ETests-Function`, {
      functionName: `${CDK_STACK_NAME}-${CDK_STACK_ENV}-E2ETests-Function`,
      runtime: Runtime.NODEJS_8_10,
      handler: 'runner.run',
      timeout: Duration.seconds(300),
      memorySize: 1024,
      code: Code.fromAsset(join(__dirname, '../e2e-tests/build')),
      environment: {
        CDK_E2E_BASE_URL,
        CDK_E2E_USERNAME,
        CDK_E2E_PASSWORD,
        CDK_AWS_REGION,
        CDK_STACK_NAME,
        CDK_STACK_ENV,
      },
    })
  }
}
