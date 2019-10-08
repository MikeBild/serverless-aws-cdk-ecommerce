import React from 'react'
import { AppProvider } from '@serverless-aws-cdk-ecommerce/react-components'

export default ({ element }) => (
  <AppProvider
    config={{
      region: `${process.env.AWS_REGION}`,
      userPoolId: `${process.env.AWS_COGNITO_USER_POOL_ID}`,
      userPoolWebClientId: `${process.env.AWS_COGNITO_USER_POOL_WEBCLIENT_ID}`,
      graphQlUrl: `${process.env.AWS_APPSYNC_URL}`,
      graphQlApiKey: `${process.env.AWS_APPSYNC_APIKEY}`,
    }}
  >
    {element}
  </AppProvider>
)
