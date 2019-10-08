const { join } = require('path')
const { Stack, Duration } = require('@aws-cdk/core')
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda')

module.exports = class E2ETests extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const { STACK_NAME, STACK_ENV, E2E_BASE_URL, E2E_USERNAME, E2E_PASSWORD } = props
    console.log(join(__dirname, '../e2e-tests/build'))
    new Function(this, `${STACK_NAME}-${STACK_ENV}-E2ETests-Function`, {
      functionName: 'e2e-tests-function',
      runtime: Runtime.NODEJS_10_X,
      handler: 'runner.run',
      timeout: Duration.seconds(300),
      memorySize: 1024,
      code: Code.fromAsset(join(__dirname, '../e2e-tests/build')),
      environment: {
        E2E_BASE_URL,
        E2E_USERNAME,
        E2E_PASSWORD,
      },
    })
  }
}
