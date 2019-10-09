const { Stack, CfnOutput } = require('@aws-cdk/core')
const { StringParameter } = require('@aws-cdk/aws-ssm')

const {
  UserPool,
  UserPoolClient,
  UserPoolAttribute,
  AuthFlow,
  CfnUserPoolGroup,
  CfnUserPoolUser,
} = require('@aws-cdk/aws-cognito')

module.exports = class Cognito extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const { CDK_COGNITO_DEFAULT_GROUPNAME, CDK_COGNITO_DEFAULT_USERNAME, CDK_STACK_NAME, CDK_STACK_ENV } = props

    this.userPool = new UserPool(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-UserPool`, {
      userPoolName: `${CDK_STACK_NAME}-${CDK_STACK_ENV}-UserPool`,
      autoVerifiedAttributes: [UserPoolAttribute.EMAIL],
      adminCreateUserConfig: {
        allowAdminCreateUserOnly: false,
      },
      policies: {
        passwordPolicy: {
          minimumLength: 6,
          requireLowercase: false,
          requireNumbers: false,
          requireSymbols: false,
          requireUppercase: false,
        },
      },
      schema: [
        {
          attributeDataType: 'String',
          name: 'email',
          required: true,
        },
      ],
    })

    new CfnOutput(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-UserPoolClient-UserPoolId`, {
      value: this.userPool.userPoolId,
    })

    new StringParameter(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-UserPoolClient-UserPoolId-Parameter`, {
      parameterName: `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_AWS_COGNITO_USER_POOL_ID`,
      stringValue: this.userPool.userPoolId,
    })

    const userPoolClient = new UserPoolClient(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-UserPoolClient`, {
      clientName: `${CDK_STACK_NAME}-${CDK_STACK_ENV}-UserPoolClient`,
      enabledAuthFlows: [AuthFlow.ADMIN_NO_SRP],
      refreshTokenValidity: 30,
      generateSecret: false,
      userPoolClientName: 'ECommerceClients',
      userPool: this.userPool,
    })

    new CfnOutput(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-UserPoolClient-UserPoolClientId`, {
      value: userPoolClient.userPoolClientId,
    })

    new StringParameter(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-UserPoolClient-UserPoolClientId-Parameter`, {
      parameterName: `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_AWS_COGNITO_USER_POOL_WEBCLIENT_ID`,
      stringValue: userPoolClient.userPoolClientId,
    })

    const defaultUser = new CfnUserPoolUser(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-DefaultUser`, {
      username: CDK_COGNITO_DEFAULT_USERNAME,
      userPoolId: this.userPool.userPoolId,
      desiredDeliveryMediums: ['EMAIL'],
      userAttributes: [
        {
          name: 'email',
          value: CDK_COGNITO_DEFAULT_USERNAME,
        },
      ],
    })

    const defaultGroup = new CfnUserPoolGroup(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-DefaultGroup`, {
      groupName: CDK_COGNITO_DEFAULT_GROUPNAME,
      userPoolId: this.userPool.userPoolId,
    })
  }
}
