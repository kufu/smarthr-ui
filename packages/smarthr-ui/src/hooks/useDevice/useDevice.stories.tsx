import { StoryFn } from '@storybook/react/*'
import React from 'react'

import { useDevice } from './useDevice'

export default {
  title: 'Hooks/useDevice',
  component: useDevice,
}

export const Default: StoryFn = () => {
  const { isNarrowView } = useDevice()

  return <p>isNarrowView: {isNarrowView.toString()}</p>
}
