# E2E Tests

**Runs E2E Tests using headless chrome with [Puppeteer](https://github.com/GoogleChrome/puppeteer) on AWS Lambda**

## Setup

```
yarn install
```

## Start local tests

```bash
yarn test
```

## Prepare for AWS Lambda deployment

```bash
yarn build
```

## Invoke the deployed AWS Lambda

```bash
yarn invoke
```