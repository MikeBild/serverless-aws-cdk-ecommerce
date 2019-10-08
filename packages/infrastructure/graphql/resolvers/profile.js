const { Construct } = require('@aws-cdk/core')
const { CfnResolver } = require('@aws-cdk/aws-appsync')

module.exports = class ProfileResolver extends Construct {
  constructor(scope, id, props) {
    super(scope, id)

    const { graphQlApi, dynamoDBDataSource, STACK_NAME, STACK_ENV } = props

    new CfnResolver(this, `${STACK_NAME}-${STACK_ENV}-ProfileUpsertMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'profileUpsert',
      typeName: 'Mutation',
      requestMappingTemplate: `
      #if($ctx.args.input.id) #set($id = $ctx.args.input.id) #else #set($id = $util.autoId()) #end
      #set($entity = "Profile")

      {
          "version" : "2017-02-28",
          "operation" : "PutItem",
          "key" : { "id": $util.dynamodb.toDynamoDBJson($id), "entity": $util.dynamodb.toDynamoDBJson($entity) },
          "attributeValues" : $util.dynamodb.toMapValuesJson($ctx.args.input)
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${STACK_NAME}-${STACK_ENV}-ProfileDeleteMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'profileDelete',
      typeName: 'Mutation',
      requestMappingTemplate: `
      #set($entity = "Profile")

      {
        "version" : "2017-02-28",
        "operation" : "DeleteItem",
        "key" : { "id" : $util.dynamodb.toDynamoDBJson($ctx.args.id), "entity": $util.dynamodb.toDynamoDBJson($entity) }
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${STACK_NAME}-${STACK_ENV}-ProfileUserResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'profile',
      typeName: 'User',
      requestMappingTemplate: `
      #set($id = $ctx.identity.username.split("@")[0])
      #set($entity = "Profile")

      {
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($id),
          "entity": $util.dynamodb.toDynamoDBJson($entity),
        },
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })
  }
}
