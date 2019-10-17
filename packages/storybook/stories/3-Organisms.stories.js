import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { MediaLibrary } from '@serverless-aws-cdk-ecommerce/react-components'

export default {
  title: '3-Organisms',
}

export function mediaLibrary() {
  return <MediaLibrary isOpen={boolean('isOpen', true)} onSelect={action('onSelect')} onClose={action('onClose')} />
}
