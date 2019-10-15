# E-Commerce Example

![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)
![badge](https://github.com/mikebild/serverless-aws-cdk-ecommerce/workflows/CICDProd/badge.svg)
![badge](https://github.com/mikebild/serverless-aws-cdk-ecommerce/workflows/CICDBeta/badge.svg)

## System Environment

- Serverless Backends using AWS

  - Cognito (JWT Auth)
  - S3 (Storage)
  - CloudFront (CDN)
  - AppSync (GraphQL Server)
  - Lambda (Functions)
  - Route53 (DNS)
  - DynamoDB (NoSQL)
  - SSM (System Manager / Parameter Store)

- Frontends using
  - JavaScript (ECMA) and TypeScript
  - React
  - React-Router
  - Apollo GraphQL Client
  - Material-UI
  - Parcel (Zero Config Bundler)
  - Gatsby (Static Website Generator)
  - Storybook (Component Development Playground)
  - Lerna (Mono-Repo)

## Setup

```bash
yarn
yarn lerna
```

## Cleanup

```bash
yarn clean
```

## Build

```bash
yarn build
```

## Development

```bash
yarn develop
```

## Deploy to AWS

```bash
yarn deploy
```
