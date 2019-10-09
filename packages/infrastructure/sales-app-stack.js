const { join } = require('path')
const { Stack, RemovalPolicy, CfnOutput } = require('@aws-cdk/core')
const { Bucket } = require('@aws-cdk/aws-s3')
const { BucketDeployment, Source } = require('@aws-cdk/aws-s3-deployment')
const { HostedZone, ARecord, AddressRecordTarget } = require('@aws-cdk/aws-route53')
const { CloudFrontTarget } = require('@aws-cdk/aws-route53-targets')
const {
  CloudFrontWebDistribution,
  ViewerProtocolPolicy,
  PriceClass,
  OriginProtocolPolicy,
} = require('@aws-cdk/aws-cloudfront')

module.exports = class SalesApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const {
      CDK_STACK_NAME,
      CDK_STACK_ENV,
      CDK_SALES_APP_DOMAIN,
      CDK_SALES_APP_HOSTNAME,
      CDK_AWS_REGION,
      CDK_AWS_ROUTE53_HOSTED_ZONEID,
      CDK_AWS_CLOUDFRONT_CERTIFICATE_ARN,
    } = props

    this.salesAppBucket = new Bucket(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-SalesApp-Bucket`, {
      bucketName: `${CDK_SALES_APP_HOSTNAME}-${CDK_STACK_ENV.toLowerCase()}.${CDK_SALES_APP_DOMAIN}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      retainOnDelete: false,
    })

    new CfnOutput(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-SalesApp-BucketWebSiteUrl`, {
      value: this.salesAppBucket.bucketWebsiteUrl,
    })

    const deployment = new BucketDeployment(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-SalesApp-Deployment`, {
      sources: [Source.asset(join(__dirname, '../sales-app/dist'))],
      destinationBucket: this.salesAppBucket,
      retainOnDelete: false,
    })

    const distribution = new CloudFrontWebDistribution(
      this,
      `${CDK_STACK_NAME}-${CDK_STACK_ENV}-SalesApp-Distribution`,
      {
        aliasConfiguration: {
          names: [`${CDK_SALES_APP_HOSTNAME}-${CDK_STACK_ENV.toLowerCase()}.${CDK_SALES_APP_DOMAIN}`],
          acmCertRef: CDK_AWS_CLOUDFRONT_CERTIFICATE_ARN,
        },
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        priceClass: PriceClass.PRICE_CLASS_100,
        originConfigs: [
          {
            customOriginSource: {
              originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
              domainName: `${this.salesAppBucket.bucketName}.s3-website.${CDK_AWS_REGION}.amazonaws.com`,
            },
            behaviors: [
              {
                forwardedValues: {
                  headers: ['*'],
                  queryString: true,
                  cookies: {
                    forward: 'all',
                  },
                },
                isDefaultBehavior: true,
                compress: true,
                minTtlSeconds: 0,
                maxTtlSeconds: 31536000,
                defaultTtlSeconds: 86400,
              },
            ],
          },
        ],
      }
    )

    const zone = HostedZone.fromHostedZoneAttributes(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-SalesApp-DNSZone`, {
      hostedZoneId: CDK_AWS_ROUTE53_HOSTED_ZONEID,
      zoneName: CDK_SALES_APP_DOMAIN,
    })

    const aRecord = new ARecord(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-SalesApp-DNSAlias`, {
      zone,
      recordName: `${CDK_SALES_APP_HOSTNAME}-${CDK_STACK_ENV.toLowerCase()}.${CDK_SALES_APP_DOMAIN}`,
      target: AddressRecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    })

    new CfnOutput(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-SalesApp-Url`, {
      value: `https://${aRecord.domainName}`,
    })
  }
}
