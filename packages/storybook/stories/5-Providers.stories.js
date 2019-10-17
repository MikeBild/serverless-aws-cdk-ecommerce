import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { AppProvider } from '@serverless-aws-cdk-ecommerce/react-components'

export default {
  title: '5-Providers',
}

export function appProvider() {
  return <AppProvider config={{}} />
}
