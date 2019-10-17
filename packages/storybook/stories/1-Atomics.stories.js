import React from 'react'
import { boolean, text, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { Loading, LoadingButton, SearchInput } from '@serverless-aws-cdk-ecommerce/react-components'

export default {
  title: '1-Atomics',
}

export function loading() {
  return <Loading isLoading={boolean('isLoading', true)} />
}

export function loadingButton() {
  return (
    <LoadingButton
      isLoading={boolean('isLoading', false)}
      isReload={boolean('isReload', false)}
      label={text('label', 'Click Me!')}
      onClick={action('onClick')}
      type={select('type', { button: 'Type Button', submit: 'Type Submit', reset: 'Type Reset' })}
    />
  )
}

export function searchInput() {
  return (
    <SearchInput placeholderText={text('placeholderText', 'A placeholder!')} onSearchClick={action('onSearchClick')} />
  )
}
