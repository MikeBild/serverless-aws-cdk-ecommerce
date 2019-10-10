const { Construct } = require('@aws-cdk/core')
const { CfnResolver } = require('@aws-cdk/aws-appsync')

module.exports = class CartResolver extends Construct {
  constructor(scope, id, props) {
    super(scope, id)

    const { graphQlApi, dynamoDBDataSource, CDK_STACK_NAME, CDK_STACK_ENV } = props

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-CartGetResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'cartGet',
      typeName: 'Query',
      requestMappingTemplate: `
      #set($entity = "Cart")

      {
        "version": "2017-02-28",
        "operation": "GetItem",
        "key" : { "id": $util.dynamodb.toDynamoDBJson($ctx.args.id), "entity": $util.dynamodb.toDynamoDBJson($entity) },
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-CartProductsResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'products',
      typeName: 'Cart',
      requestMappingTemplate: `
      #set($ids = [])

      #foreach($id in \${ctx.source.productIds})
          #set($map = {})
          $util.qr($map.put("id", $util.dynamodb.toString($id)))
          $util.qr($map.put("entity", $util.dynamodb.toString("Product")))
          $util.qr($ids.add($map))
      #end

      {
          "version" : "2018-05-29",
          "operation" : "BatchGetItem",
          "tables" : {
              "${CDK_STACK_NAME}-Table-${CDK_STACK_ENV}": {
                  "keys": #if($ctx.source.productIds.size() != 0) $util.toJson($ids) #else $util.toJson([{"id": $util.dynamodb.toString("undefined")}]) #end,
                  "consistentRead": true
              }
          }
      }
      `,
      responseMappingTemplate: `$util.toJson($ctx.result.data["${CDK_STACK_NAME}-Table-${CDK_STACK_ENV}"])`,
    })

    new CfnResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-CartUpsertMutationResolver`, {
      dataSourceName: dynamoDBDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'cartUpsert',
      typeName: 'Mutation',
      requestMappingTemplate: `
      #if($ctx.args.input.id) #set($id = $ctx.args.input.id) #else #set($id = $util.autoId()) #end
      #set($entity = "Cart")

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
