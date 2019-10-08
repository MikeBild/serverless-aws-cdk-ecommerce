const { Stack, CfnOutput } = require('@aws-cdk/core')

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

    const { DEFAULT_GROUPNAME, DEFAULT_USERNAME, STACK_NAME, STACK_ENV } = props

    this.userPool = new UserPool(this, `${STACK_NAME}-${STACK_ENV}-UserPool`, {
      userPoolName: `${STACK_NAME}-${STACK_ENV}-UserPool`,
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

    const userPoolClient = new UserPoolClient(this, `${STACK_NAME}-${STACK_ENV}-UserPoolClient`, {
      clientName: `${STACK_NAME}-${STACK_ENV}-UserPoolClient`,
      enabledAuthFlows: [AuthFlow.ADMIN_NO_SRP],
      refreshTokenValidity: 30,
      generateSecret: false,
      userPoolClientName: 'ECommerceClients',
      userPool: this.userPool,
    })

    new CfnOutput(this, `${STACK_NAME}-${STACK_ENV}-UserPoolClient-UserPoolClientId`, {
      value: userPoolClient.userPoolClientId,
    })

    const defaultUser = new CfnUserPoolUser(this, `${STACK_NAME}-${STACK_ENV}-DefaultUser`, {
      username: DEFAULT_USERNAME,
      userPoolId: this.userPool.userPoolId,
      desiredDeliveryMediums: ['EMAIL'],
      userAttributes: [
        {
          name: 'email',
          value: DEFAULT_USERNAME,
        },
      ],
    })

    const exampleUser = new CfnUserPoolUser(this, `${STACK_NAME}-${STACK_ENV}-ExampleUser`, {
      username: 'demo@example.com',
      userPoolId: this.userPool.userPoolId,
      desiredDeliveryMediums: ['EMAIL'],
      userAttributes: [
        {
          name: 'email',
          value: 'mike.bild@gmail.com',
        },
      ],
    })

    const defaultGroup = new CfnUserPoolGroup(this, `${STACK_NAME}-${STACK_ENV}-DefaultGroup`, {
      groupName: DEFAULT_GROUPNAME,
      userPoolId: this.userPool.userPoolId,
    })
  }
}
