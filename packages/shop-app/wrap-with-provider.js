import 'isomorphic-fetch'
import 'roboto-fontface'
import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { AppProvider } from '@serverless-aws-cdk-ecommerce/react-components'
import theme from './theme'

export default ({ element }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
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
  </ThemeProvider>
)
