const dotenv = require('dotenv')
const { Stack } = require('@aws-cdk/core')
const { StringParameter } = require('@aws-cdk/aws-ssm')

module.exports = class SSM extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const { CDK_STACK_NAME, CDK_STACK_ENV } = props

    Object.keys(props)
      .filter(key => key.startsWith('CDK_'))
      .forEach(key => {
        new StringParameter(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-${key}-SSM-Parameter`, {
          parameterName: `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/${key}`,
          stringValue: props[key],
        })
      })
  }
}
