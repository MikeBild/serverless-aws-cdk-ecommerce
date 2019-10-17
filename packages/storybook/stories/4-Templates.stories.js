import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { Layout, AppProvider } from '@serverless-aws-cdk-ecommerce/react-components'

export default {
  title: '4-Templates',
}

export function layout() {
  return (
    <AppProvider config={{}}>
      <Layout />
    </AppProvider>
  )
}
