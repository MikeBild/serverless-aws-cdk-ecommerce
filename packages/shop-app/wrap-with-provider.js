import 'isomorphic-fetch'
import 'roboto-fontface'
import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { AppProvider } from '@serverless-aws-cdk-ecommerce/react-components'
import theme from './theme'

const config = {
  userPoolId: process.env.CDK_AWS_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.CDK_AWS_COGNITO_USER_POOL_WEBCLIENT_ID,
  graphQlUrl: process.env.CDK_AWS_APPSYNC_URL,
  graphQlApiKey: process.env.CDK_AWS_APPSYNC_APIKEY,
}
export default ({ element }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppProvider config={config}>{element}</AppProvider>
  </ThemeProvider>
)
