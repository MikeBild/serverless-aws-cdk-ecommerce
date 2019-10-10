const { Construct } = require('@aws-cdk/core')
const { CfnResolver } = require('@aws-cdk/aws-appsync')

module.exports = class ProfileResolver extends Construct {
  constructor(scope, id, props) {
    super(scope, id)

    const { graphQlApi, dynamoDBDataSource, CDK_STACK_NAME, CDK_STACK_ENV } = props

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ProfileMeResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'profile',
      typeName: 'Me',
      requestMappingTemplate: `
      {
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.identity.username),
          "entity": $util.dynamodb.toDynamoDBJson("Profile"),
        },
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ProfileUpsertMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'profileUpsert',
      typeName: 'Mutation',
      requestMappingTemplate: `
      {
        "version" : "2017-02-28",
        "operation" : "PutItem",
        "key" : { "id": $util.dynamodb.toDynamoDBJson($ctx.identity.username), "entity": $util.dynamodb.toDynamoDBJson("Profile") },
        "attributeValues" : $util.dynamodb.toMapValuesJson($ctx.args.input)
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ProfileDeleteMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'profileDelete',
      typeName: 'Mutation',
      requestMappingTemplate: `
      {
        "version" : "2017-02-28",
        "operation" : "DeleteItem",
        "key" : { "id" : $util.dynamodb.toDynamoDBJson($ctx.identity.username), "entity": $util.dynamodb.toDynamoDBJson("Profile") }
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })
  }
}
