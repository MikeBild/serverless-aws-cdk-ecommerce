const dotenv = require('dotenv')
const { Stack } = require('@aws-cdk/core')
const { StringParameter } = require('@aws-cdk/aws-ssm')

module.exports = class Env extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const { CDK_STACK_NAME, CDK_STACK_ENV } = props

    const graphQlApiKey = StringParameter.valueFromLookup(this, `CDK_`)
    console.log({ graphQlApiKey })
  }
}
