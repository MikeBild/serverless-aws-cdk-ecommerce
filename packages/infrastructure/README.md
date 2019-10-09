# AWS Serverless Infrastructure as Code

## Deploy environments

### Setup environment "Demo"

**Configure** the AWS SSM parameter store

**.env**

```
CDK_STACK_NAME=
CDK_STACK_ENV=Demo
CDK_AWS_REGION=eu-central-1
CDK_AWS_ACCOUNT=
```

**.env.Demo**

```
CDK_AWS_ROUTE53_HOSTED_ZONEID=
CDK_AWS_CLOUDFRONT_CERTIFICATE_ARN=

CDK_COGNITO_DEFAULT_USERNAME=
CDK_COGNITO_DEFAULT_GROUPNAME=

CDK_SHOP_APP_HOSTNAME=
CDK_SHOP_APP_DOMAIN=

CDK_SALES_APP_HOSTNAME=
CDK_SALES_APP_DOMAIN=

CDK_STORYBOOK_APP_HOSTNAME=
CDK_STORYBOOK_APP_DOMAIN=

CDK_E2E_USERNAME=
CDK_E2E_PASSWORD=
```

**Deploy Configuration**

```
CDK_STACK_ENV=Demo yarn deploy:configs "ECommerce-*"
```

**Deploy Backends**

```
yarn deploy:backends "ECommerce-*"
```

**Deploy Frontends**

```
yarn deploy:frontends "ECommerce-*"
```
