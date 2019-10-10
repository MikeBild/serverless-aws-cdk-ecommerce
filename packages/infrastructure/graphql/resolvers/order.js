const { Construct } = require('@aws-cdk/core')
const { CfnResolver } = require('@aws-cdk/aws-appsync')

module.exports = class OrderResolver extends Construct {
  constructor(scope, id, props) {
    super(scope, id)

    const { graphQlApi, dynamoDBDataSource, CDK_STACK_NAME, CDK_STACK_ENV } = props

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-OrderGetResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'orderGet',
      typeName: 'Query',
      requestMappingTemplate: `
      #set($entity = "Order")

      {
        "version": "2017-02-28",
        "operation": "GetItem",
        "key" : { "id": $util.dynamodb.toDynamoDBJson($ctx.args.id), "entity": $util.dynamodb.toDynamoDBJson($entity) },
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-OrderForCartMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'orderForCart',
      typeName: 'Mutation',
      requestMappingTemplate: `
      #if($ctx.args.input.id) #set($id = $ctx.args.input.id) #else #set($id = $util.autoId()) #end
      #set($entity = "Order")

      {
          "version" : "2017-02-28",
          "operation" : "PutItem",
          "key" : { "id": $util.dynamodb.toDynamoDBJson($id), "entity": $util.dynamodb.toDynamoDBJson($entity) },
          "attributeValues" : $util.dynamodb.toMapValuesJson($ctx.args.input)
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })
  }
}
