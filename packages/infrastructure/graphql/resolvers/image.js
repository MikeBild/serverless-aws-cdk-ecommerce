const { Construct } = require('@aws-cdk/core')
const { CfnResolver } = require('@aws-cdk/aws-appsync')

module.exports = class ImageResolver extends Construct {
  constructor(scope, id, props) {
    super(scope, id)

    const { graphQlApi, dynamoDBDataSource, CDK_STACK_NAME, CDK_STACK_ENV } = props

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ImageListResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'imageList',
      typeName: 'Query',
      requestMappingTemplate: `
      #set($entity = "Image")
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

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ImageGetResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'imageGet',
      typeName: 'Query',
      requestMappingTemplate: `
      #set($entity = "Image")

      {
        "version": "2017-02-28",
        "operation": "GetItem",
        "key" : { "id": $util.dynamodb.toDynamoDBJson($ctx.args.id), "entity": $util.dynamodb.toDynamoDBJson($entity) },
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ImageUpsertMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'imageUpsert',
      typeName: 'Mutation',
      requestMappingTemplate: `
      #if($ctx.args.input.id) #set($id = $ctx.args.input.id) #else #set($id = $util.autoId()) #end
      #set($entity = "Image")

      {
          "version" : "2017-02-28",
          "operation" : "PutItem",
          "key" : { "id": $util.dynamodb.toDynamoDBJson($id), "entity": $util.dynamodb.toDynamoDBJson($entity) },
          "attributeValues" : $util.dynamodb.toMapValuesJson($ctx.args.input)
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ImageDeleteMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'imageDelete',
      typeName: 'Mutation',
      requestMappingTemplate: `
      #set($entity = "Image")

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
