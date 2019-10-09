const { Construct, RemovalPolicy } = require('@aws-cdk/core')
const { CfnDataSource } = require('@aws-cdk/aws-appsync')
const { Table, AttributeType, BillingMode } = require('@aws-cdk/aws-dynamodb')

module.exports = class DynamoDBDataSource extends Construct {
  constructor(scope, id, props) {
    super(scope, id)

    const { graphQlApi, appSyncServiceRole, deliveryPublishLambda, CDK_STACK_NAME, CDK_STACK_ENV } = props

    const dynamoDBTable = new Table(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-DynamoDB-Table`, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'entity', type: AttributeType.STRING },
      tableName: `${CDK_STACK_NAME}-Table-${CDK_STACK_ENV}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    this.dynamoDBDataSource = new CfnDataSource(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-DynamoDB-DataSource`, {
      name: 'DynamoDB',
      type: 'AMAZON_DYNAMODB',
      apiId: graphQlApi.attrApiId,
      serviceRoleArn: appSyncServiceRole.roleArn,
      dynamoDbConfig: {
        tableName: dynamoDBTable.tableName,
        awsRegion: 'eu-central-1',
        useCallerCredentials: false,
      },
    })

    this.parentDataSource = new CfnDataSource(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-Parent-DataSource`, {
      name: 'Parent',
      type: 'NONE',
      apiId: graphQlApi.attrApiId,
    })
  }
}
