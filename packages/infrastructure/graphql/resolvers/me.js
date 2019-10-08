const { Construct } = require('@aws-cdk/core')
const { CfnResolver } = require('@aws-cdk/aws-appsync')

module.exports = class MeResolver extends Construct {
  constructor(scope, id, props) {
    super(scope, id)

    const { graphQlApi, parentDataSource, STACK_NAME, STACK_ENV } = props

    new CfnResolver(this, `${STACK_NAME}-${STACK_ENV}-MeGetResolver`, {
      dataSourceName: parentDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'me',
      typeName: 'Query',
      requestMappingTemplate: `{"version": "2017-02-28", "payload": {}}`,
      responseMappingTemplate: `$util.toJson({})`,
    })

    new CfnResolver(this, `${STACK_NAME}-${STACK_ENV}-MeUserResolver`, {
      dataSourceName: parentDataSource.attrName,
      apiId: graphQlApi.attrApiId,
      fieldName: 'user',
      typeName: 'Me',
      requestMappingTemplate: `{"version": "2017-02-28", "payload": {}}`,
      responseMappingTemplate: `
        #set($result = {
          "username": $ctx.identity.username,
          "id": $ctx.identity.username
        })

        $util.toJson($result)
      `,
    })
  }
}
