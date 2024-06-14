import { StoryFn } from '@storybook/react'
import React from 'react'

import { Text } from '../Text'

import { ErrorScreen } from '.'

export default {
  title: 'Page Templates（ページテンプレート）/ErrorScreen',
  component: ErrorScreen,
  parameters: {
    layout: 'fullscreen',
  },
}

export const All: StoryFn = () => (
  <ErrorScreen
    className="shr-w-full"
    title="タイトル"
    links={[
      {
        label: 'リンク1',
        url: '/',
      },
      {
        label: 'リンク2',
        url: '/',
      },
      {
        label: 'リンク3',
        url: '/',
        target: '_blank',
      },
    ]}
  >
    <Text as="p" className="shr-text-center">
      メッセージ
    </Text>
  </ErrorScreen>
)
All.storyName = 'all'
