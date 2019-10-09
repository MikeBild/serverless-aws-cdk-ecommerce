const { Stack } = require('@aws-cdk/core')

const { CfnUserPoolUserToGroupAttachment } = require('@aws-cdk/aws-cognito')

module.exports = class Cognito extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const { defaultGroup, defaultUser, CDK_STACK_NAME, CDK_STACK_ENV } = props

    new CfnUserPoolUserToGroupAttachment(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-DefaultUserToGroupAttachment`, {
      userPoolId: this.userPool.userPoolId,
      groupName: defaultGroup.groupName,
      username: defaultUser.username,
    })
  }
}
