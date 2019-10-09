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

module.exports = class ShopApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const {
      CDK_STACK_NAME,
      CDK_STACK_ENV,
      CDK_SHOP_APP_DOMAIN,
      CDK_SHOP_APP_HOSTNAME,
      CDK_AWS_REGION,
      CDK_AWS_ROUTE53_HOSTED_ZONEID,
      CDK_AWS_CLOUDFRONT_CERTIFICATE_ARN,
    } = props

    this.shopAppBucket = new Bucket(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ShopApp-Bucket`, {
      bucketName: `${CDK_SHOP_APP_HOSTNAME}-${CDK_STACK_ENV}.${CDK_SHOP_APP_DOMAIN}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      retainOnDelete: false,
    })

    new CfnOutput(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ShopApp-BucketWebSiteUrl`, {
      value: this.shopAppBucket.bucketWebsiteUrl,
    })

    const deployment = new BucketDeployment(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ShopApp-Deployment`, {
      sources: [Source.asset(join(__dirname, '../shop-app/public'))],
      destinationBucket: this.shopAppBucket,
      retainOnDelete: false,
    })

    const distribution = new CloudFrontWebDistribution(
      this,
      `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ShopApp-Distribution`,
      {
        aliasConfiguration: {
          names: [`${CDK_SHOP_APP_HOSTNAME}-${CDK_STACK_ENV}.${CDK_SHOP_APP_DOMAIN}`],
          acmCertRef: CDK_AWS_CLOUDFRONT_CERTIFICATE_ARN,
        },
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        priceClass: PriceClass.PRICE_CLASS_100,
        originConfigs: [
          {
            customOriginSource: {
              originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
              domainName: `${this.shopAppBucket.bucketName}.s3-website.${CDK_AWS_REGION}.amazonaws.com`,
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

    const zone = HostedZone.fromHostedZoneAttributes(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ShopApp-DNSZone`, {
      hostedZoneId: CDK_AWS_ROUTE53_HOSTED_ZONEID,
      zoneName: CDK_SHOP_APP_DOMAIN,
    })

    const aRecord = new ARecord(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ShopApp-DNSAlias`, {
      zone,
      recordName: `${CDK_SHOP_APP_HOSTNAME}-${CDK_STACK_ENV}.${CDK_SHOP_APP_DOMAIN}`,
      target: AddressRecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    })

    new CfnOutput(this, `${CDK_STACK_NAME}-${CDK_STACK_ENV}-ShopApp-Url`, {
      value: `https://${aRecord.domainName}`,
    })
  }
}
