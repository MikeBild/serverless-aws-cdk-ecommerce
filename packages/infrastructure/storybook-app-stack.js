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

module.exports = class StorybookApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props)

    const {
      STORYBOOK_APP_DOMAIN,
      STORYBOOK_APP_HOSTNAME,
      STACK_NAME,
      STACK_ENV,
      AWS_REGION,
      AWS_ROUTE53_HOSTED_ZONEID,
      AWS_CLOUDFRONT_CERTIFICATE_ARN,
    } = props

    this.storybookAppBucket = new Bucket(this, `${STACK_NAME}-${STACK_ENV}-StorybookApp-Bucket`, {
      bucketName: `${STORYBOOK_APP_HOSTNAME}.${STORYBOOK_APP_DOMAIN}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      retainOnDelete: false,
    })

    new CfnOutput(this, `${STACK_NAME}-${STACK_ENV}-StorybookApp-BucketWebSiteUrl`, {
      value: this.storybookAppBucket.bucketWebsiteUrl,
    })

    const deployment = new BucketDeployment(this, `${STACK_NAME}-${STACK_ENV}-StorybookApp-Deployment`, {
      sources: [Source.asset(join(__dirname, '../storybook/storybook-static'))],
      destinationBucket: this.storybookAppBucket,
      retainOnDelete: false,
    })

    const distribution = new CloudFrontWebDistribution(this, `${STACK_NAME}-${STACK_ENV}-StorybookApp-Distribution`, {
      aliasConfiguration: {
        names: [`${STORYBOOK_APP_HOSTNAME}.${STORYBOOK_APP_DOMAIN}`],
        acmCertRef: AWS_CLOUDFRONT_CERTIFICATE_ARN,
      },
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      priceClass: PriceClass.PRICE_CLASS_100,
      originConfigs: [
        {
          customOriginSource: {
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
            domainName: `${this.storybookAppBucket.bucketName}.s3-website.${AWS_REGION}.amazonaws.com`,
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

    const zone = HostedZone.fromHostedZoneAttributes(this, `${STACK_NAME}-${STACK_ENV}-StorybookApp-DNSZone`, {
      hostedZoneId: AWS_ROUTE53_HOSTED_ZONEID,
      zoneName: STORYBOOK_APP_DOMAIN,
    })

    const aRecord = new ARecord(this, `${STACK_NAME}-${STACK_ENV}-StorybookApp-DNSAlias`, {
      zone,
      recordName: `${STORYBOOK_APP_HOSTNAME}.${STORYBOOK_APP_DOMAIN}`,
      target: AddressRecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    })

    new CfnOutput(this, `${STACK_NAME}-${STACK_ENV}-StorybookApp-Url`, {
      value: `https://${aRecord.domainName}`,
    })
  }
}
