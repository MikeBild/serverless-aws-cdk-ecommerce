const { join } = require('path')
const { readFileSync } = require('fs')
const { Stack, CfnOutput } = require('@aws-cdk/core')
const { Role, PolicyStatement, Effect, ServicePrincipal } = require('@aws-cdk/aws-iam')
const { CfnGraphQLApi, CfnApiKey, CfnGraphQLSchema, CfnDataSource } = require('@aws-cdk/aws-appsync')

const DataSources = require('./graphql/datasources')
const ProfileResolver = require('./graphql/resolvers/profile')
const ProductResolver = require('./graphql/resolvers/product')
const ImageResolver = require('./graphql/resolvers/image')
const MeResolver = require('./graphql/resolvers/me')

module.exports = class GraphQL extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const { STACK_NAME, STACK_ENV, userPool, deliveryPublishLambda } = props
    const definition = readFileSync(join(__dirname, 'graphql', 'schema.graphql')).toString()

    const logsServiceRole = new Role(this, `${STACK_NAME}-${STACK_ENV}-GraphQLLogsRole`, {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    })

    const logsServicePolicyStatement = new PolicyStatement(Effect.Allow)
    logsServicePolicyStatement.addActions(['logs:*'])
    logsServicePolicyStatement.addAllResources()

    logsServiceRole.addToPolicy(logsServicePolicyStatement)

    this.graphQlApi = new CfnGraphQLApi(this, `${STACK_NAME}-${STACK_ENV}-GraphQL`, {
      name: `${STACK_NAME}-${STACK_ENV}-GraphQL`,
      authenticationType: 'API_KEY',
      additionalAuthenticationProviders: [
        {
          authenticationType: 'AMAZON_COGNITO_USER_POOLS',
          userPoolConfig: {
            awsRegion: 'eu-central-1',
            userPoolId: userPool.userPoolId,
          },
        },
      ],
      logConfig: {
        cloudWatchLogsRoleArn: logsServiceRole.roleArn,
        fieldLogLevel: 'ALL',
      },
    })

    new CfnOutput(this, `${STACK_NAME}-${STACK_ENV}-GraphQL-GraphQlUrl`, {
      value: this.graphQlApi.attrGraphQlUrl,
    })

    const graphqlApiKey = new CfnApiKey(this, `${STACK_NAME}-${STACK_ENV}-GraphQL-ApiKey`, {
      apiId: this.graphQlApi.attrApiId,
      // expires: 365,
    })

    new CfnOutput(this, `${STACK_NAME}-${STACK_ENV}-GraphQL-GraphQlApiKey`, {
      value: graphqlApiKey.attrApiKey,
    })

    new CfnGraphQLSchema(this, `${STACK_NAME}-${STACK_ENV}-GraphQL-Schema`, {
      apiId: this.graphQlApi.attrApiId,
      definition,
    })

    const lambdaServiceRole = new Role(this, `${STACK_NAME}-${STACK_ENV}-GraphQL-LambdaRole`, {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    })

    const lambdaServicePolicyStatement = new PolicyStatement(Effect.Allow)
    lambdaServicePolicyStatement.addActions(['lambda:*'])
    lambdaServicePolicyStatement.addAllResources()

    lambdaServiceRole.addToPolicy(lambdaServicePolicyStatement)

    const appSyncServiceRole = new Role(this, `${STACK_NAME}-${STACK_ENV}-GraphQL-DynamoDBRole`, {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    })

    const dynamoDBPolicyStatement = new PolicyStatement(Effect.Allow)
    dynamoDBPolicyStatement.addActions(['dynamodb:*'])
    dynamoDBPolicyStatement.addAllResources()

    appSyncServiceRole.addToPolicy(dynamoDBPolicyStatement)

    const lambdaPolicyStatement = new PolicyStatement(Effect.Allow)
    lambdaPolicyStatement.addActions(['lambda:*'])
    lambdaPolicyStatement.addAllResources()

    appSyncServiceRole.addToPolicy(lambdaPolicyStatement)

    const { parentDataSource, dynamoDBDataSource } = new DataSources(this, `${STACK_NAME}-${STACK_ENV}-DataSources`, {
      STACK_NAME,
      STACK_ENV,
      appSyncServiceRole,
      graphQlApi: this.graphQlApi,
      deliveryPublishLambda,
    })

    new MeResolver(this, `${STACK_NAME}-${STACK_ENV}-MeResolver`, {
      STACK_NAME,
      STACK_ENV,
      parentDataSource,
      graphQlApi: this.graphQlApi,
    })

    new ProfileResolver(this, `${STACK_NAME}-${STACK_ENV}-ProfileResolver`, {
      STACK_NAME,
      STACK_ENV,
      dynamoDBDataSource,
      graphQlApi: this.graphQlApi,
    })

    new ProductResolver(this, `${STACK_NAME}-${STACK_ENV}-ProductResolver`, {
      STACK_NAME,
      STACK_ENV,
      dynamoDBDataSource,
      graphQlApi: this.graphQlApi,
    })

    new ImageResolver(this, `${STACK_NAME}-${STACK_ENV}-ImageResolver`, {
      STACK_NAME,
      STACK_ENV,
      dynamoDBDataSource,
      graphQlApi: this.graphQlApi,
    })
  }
}
