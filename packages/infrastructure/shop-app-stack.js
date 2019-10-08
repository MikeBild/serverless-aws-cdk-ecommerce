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
      SHOP_APP_DOMAIN,
      SHOP_APP_HOSTNAME,
      STACK_NAME,
      STACK_ENV,
      AWS_REGION,
      AWS_ROUTE53_HOSTED_ZONEID,
      AWS_CLOUDFRONT_CERTIFICATE_ARN,
    } = props

    this.shopAppBucket = new Bucket(this, `${STACK_NAME}-${STACK_ENV}-ShopApp-Bucket`, {
      bucketName: `${SHOP_APP_HOSTNAME}.${SHOP_APP_DOMAIN}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      retainOnDelete: false,
    })

    new CfnOutput(this, `${STACK_NAME}-${STACK_ENV}-ShopApp-BucketWebSiteUrl`, {
      value: this.shopAppBucket.bucketWebsiteUrl,
    })

    const deployment = new BucketDeployment(this, `${STACK_NAME}-${STACK_ENV}-ShopApp-Deployment`, {
      sources: [Source.asset(join(__dirname, '../shop-app/public'))],
      destinationBucket: this.shopAppBucket,
      retainOnDelete: false,
    })

    const distribution = new CloudFrontWebDistribution(this, `${STACK_NAME}-${STACK_ENV}-ShopApp-Distribution`, {
      aliasConfiguration: {
        names: [`${SHOP_APP_HOSTNAME}.${SHOP_APP_DOMAIN}`],
        acmCertRef: AWS_CLOUDFRONT_CERTIFICATE_ARN,
      },
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      priceClass: PriceClass.PRICE_CLASS_100,
      originConfigs: [
        {
          customOriginSource: {
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
            domainName: `${this.shopAppBucket.bucketName}.s3-website.${AWS_REGION}.amazonaws.com`,
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
    })

    const zone = HostedZone.fromHostedZoneAttributes(this, `${STACK_NAME}-${STACK_ENV}-ShopApp-DNSZone`, {
      hostedZoneId: AWS_ROUTE53_HOSTED_ZONEID,
      zoneName: SHOP_APP_DOMAIN,
    })

    const aRecord = new ARecord(this, `${STACK_NAME}-${STACK_ENV}-ShopApp-DNSAlias`, {
      zone,
      recordName: `${SHOP_APP_HOSTNAME}.${SHOP_APP_DOMAIN}`,
      target: AddressRecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    })

    new CfnOutput(this, `${STACK_NAME}-${STACK_ENV}-ShopApp-Url`, {
      value: `https://${aRecord.domainName}`,
    })
  }
}
