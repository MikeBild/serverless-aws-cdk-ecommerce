const { join } = require('path')
const { readFileSync } = require('fs')
const { Stack, CfnOutput } = require('@aws-cdk/core')
const { StringParameter } = require('@aws-cdk/aws-ssm')
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

    const { CDK_STACK_NAME, CDK_STACK_ENV, userPool, deliveryPublishLambda } = props
    const definition = readFileSync(join(__dirname, 'graphql', 'schema.graphql')).toString()

    const logsServiceRole = new Role(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQLLogsRole`, {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    })

    const logsServicePolicyStatement = new PolicyStatement(Effect.Allow)
    logsServicePolicyStatement.addActions(['logs:*'])
    logsServicePolicyStatement.addAllResources()

    logsServiceRole.addToPolicy(logsServicePolicyStatement)

    this.graphQlApi = new CfnGraphQLApi(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL`, {
      name: `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL`,
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

    new CfnOutput(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL-GraphQlUrl`, {
      value: this.graphQlApi.attrGraphQlUrl,
    })

    new StringParameter(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL-GraphQlUrl-Parameter`, {
      parameterName: `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_AWS_APPSYNC_URL`,
      stringValue: this.graphQlApi.attrGraphQlUrl,
    })

    const now = new Date()
    now.setSeconds(now.getSeconds() + 31536000) //add 365 days
    const expires = Math.round(now.getTime() / 1000)
    this.graphqlApiKey = new CfnApiKey(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL-ApiKey`, {
      apiId: this.graphQlApi.attrApiId,
      expires,
    })

    new CfnOutput(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL-GraphQlApiKey`, {
      value: this.graphqlApiKey.attrApiKey,
    })

    new StringParameter(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL-GraphQlApiKey-Parameter`, {
      parameterName: `/${CDK_STACK_NAME}/${CDK_STACK_ENV}/CDK_AWS_APPSYNC_APIKEY`,
      stringValue: this.graphqlApiKey.attrApiKey,
    })

    new CfnGraphQLSchema(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL-Schema`, {
      apiId: this.graphQlApi.attrApiId,
      definition,
    })

    const lambdaServiceRole = new Role(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL-LambdaRole`, {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    })

    const lambdaServicePolicyStatement = new PolicyStatement(Effect.Allow)
    lambdaServicePolicyStatement.addActions(['lambda:*'])
    lambdaServicePolicyStatement.addAllResources()

    lambdaServiceRole.addToPolicy(lambdaServicePolicyStatement)

    const appSyncServiceRole = new Role(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-GraphQL-DynamoDBRole`, {
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

    const { parentDataSource, dynamoDBDataSource } = new DataSources(
      this,
      `${CDK_STACK_NAME}-${CDK_STACK_ENV}-DataSources`,
      {
        CDK_STACK_NAME,
        CDK_STACK_ENV,
        appSyncServiceRole,
        graphQlApi: this.graphQlApi,
        deliveryPublishLambda,
      }
    )

    new MeResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-MeResolver`, {
      CDK_STACK_NAME,
      CDK_STACK_ENV,
      parentDataSource,
      graphQlApi: this.graphQlApi,
    })

    new ProfileResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ProfileResolver`, {
      CDK_STACK_NAME,
      CDK_STACK_ENV,
      dynamoDBDataSource,
      graphQlApi: this.graphQlApi,
    })

    new ProductResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ProductResolver`, {
      CDK_STACK_NAME,
      CDK_STACK_ENV,
      dynamoDBDataSource,
      graphQlApi: this.graphQlApi,
    })

    new ImageResolver(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ImageResolver`, {
      CDK_STACK_NAME,
      CDK_STACK_ENV,
      dynamoDBDataSource,
      graphQlApi: this.graphQlApi,
    })
  }
}
