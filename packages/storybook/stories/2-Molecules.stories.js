import React from 'react'
import { boolean, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { ConfirmDialog, Topbar } from '@serverless-aws-cdk-ecommerce/react-components'

export default {
  title: '2-Molecules',
}

export function confirmDialog() {
  return (
    <ConfirmDialog
      isOpen={boolean('isOpen', true)}
      content={text('content', 'Some content')}
      title={text('title', 'A title!')}
      onAgree={action('onAgree')}
      onClose={action('onClose')}
      onDisagree={action('onDisagree')}
    />
  )
}

export function topbar() {
  return (
    <Topbar
      onAddClick={action('onAddClick')}
      onDeleteClick={action('onDeleteClick')}
      onPublishClick={action('onPublishClick')}
    />
  )
}
