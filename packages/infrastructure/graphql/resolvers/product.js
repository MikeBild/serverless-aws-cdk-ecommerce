const { Construct } = require('@aws-cdk/core')
const { CfnResolver } = require('@aws-cdk/aws-appsync')

module.exports = class ProductResolver extends Construct {
  constructor(scope, id, props) {
    super(scope, id)

    const { graphQlApi, dynamoDBDataSource, STACK_NAME, STACK_ENV } = props

    new CfnResolver(this, `${STACK_NAME}-${STACK_ENV}-ProductListResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'productList',
      typeName: 'Query',
      requestMappingTemplate: `
      #set($entity = "Product")
      #set($ctx.args.filter.entity = { "eq": $entity })
      #set($userFilter = { "entity": { "eq": $entity } })

      {
        "version": "2017-02-28",
        "operation": "Scan",
        "filter": #if($context.args.filter) $util.transform.toDynamoDBFilterExpression($ctx.args.filter) #else $util.transform.toDynamoDBFilterExpression($userFilter) #end,
        "limit": #if($ctx.args.limit) $ctx.args.limit #else null #end,
        "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.nextToken, null)),
      }
      `,
      responseMappingTemplate: `
        {
          "items": $util.toJson($ctx.result.items),
          "nextToken": $util.toJson($util.defaultIfNullOrBlank($context.result.nextToken, null))
        }
      `,
    })

    new CfnResolver(this, `${STACK_NAME}-${STACK_ENV}-ProductGetResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'productGet',
      typeName: 'Query',
      requestMappingTemplate: `
      #set($entity = "Product")

      {
        "version": "2017-02-28",
        "operation": "GetItem",
        "key" : { "id": $util.dynamodb.toDynamoDBJson($ctx.args.id), "entity": $util.dynamodb.toDynamoDBJson($entity) },
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${STACK_NAME}-${STACK_ENV}-ProductUpsertMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'productUpsert',
      typeName: 'Mutation',
      requestMappingTemplate: `
      #if($ctx.args.input.id) #set($id = $ctx.args.input.id) #else #set($id = $util.autoId()) #end
      #set($entity = "Product")

      {
          "version" : "2017-02-28",
          "operation" : "PutItem",
          "key" : { "id": $util.dynamodb.toDynamoDBJson($id), "entity": $util.dynamodb.toDynamoDBJson($entity) },
          "attributeValues" : $util.dynamodb.toMapValuesJson($ctx.args.input)
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${STACK_NAME}-${STACK_ENV}-ProductDeleteMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'productDelete',
      typeName: 'Mutation',
      requestMappingTemplate: `
      #set($entity = "Product")

      {
        "version" : "2017-02-28",
        "operation" : "DeleteItem",
        "key" : { "id" : $util.dynamodb.toDynamoDBJson($ctx.args.id), "entity": $util.dynamodb.toDynamoDBJson($entity) }
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })
  }
}
