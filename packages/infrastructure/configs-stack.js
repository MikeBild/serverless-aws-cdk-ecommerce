const dotenv = require('dotenv')
const { Stack } = require('@aws-cdk/core')
const { StringParameter } = require('@aws-cdk/aws-ssm')

module.exports = class Env extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const { CDK_STACK_NAME, CDK_STACK_ENV } = props
    this.configs = {}

    this.configs.CDK_AWS_REGION = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_AWS_REGION`
    )
    this.configs.CDK_AWS_ACCOUNT = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_AWS_ACCOUNT`
    )
    this.configs.CDK_AWS_ROUTE53_HOSTED_ZONEID = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_AWS_ROUTE53_HOSTED_ZONEID`
    )
    this.configs.CDK_AWS_CLOUDFRONT_CERTIFICATE_ARN = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_AWS_CLOUDFRONT_CERTIFICATE_ARN`
    )

    this.configs.CDK_COGNITO_DEFAULT_USERNAME = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_COGNITO_DEFAULT_USERNAME`
    )
    this.configs.CDK_COGNITO_DEFAULT_GROUPNAME = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_COGNITO_DEFAULT_GROUPNAME`
    )

    this.configs.CDK_SHOP_APP_HOSTNAME = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_SHOP_APP_HOSTNAME`
    )
    this.configs.CDK_SHOP_APP_DOMAIN = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_SHOP_APP_DOMAIN`
    )

    this.configs.CDK_SALES_APP_HOSTNAME = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_SALES_APP_HOSTNAME`
    )
    this.configs.CDK_SALES_APP_DOMAIN = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_SALES_APP_DOMAIN`
    )

    this.configs.CDK_STORYBOOK_APP_HOSTNAME = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_STORYBOOK_APP_HOSTNAME`
    )
    this.configs.CDK_STORYBOOK_APP_DOMAIN = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_STORYBOOK_APP_DOMAIN`
    )

    this.configs.CDK_E2E_USERNAME = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_E2E_USERNAME`
    )
    this.configs.CDK_E2E_PASSWORD = StringParameter.valueFromLookup(
      this,
      `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_E2E_PASSWORD`
    )
  }
}
