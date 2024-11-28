import React from 'react'

import { ErrorScreen } from '../ErrorScreen'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Page Templates（ページテンプレート）/ErrorScreen/VRT',
  render: (args) => <ErrorScreen {...args} />,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ErrorScreen>

export const VRT = {
  args: {
    title: 'エラーが発生しました',
    children: 'エラーメッセージがここに表示されます',
    links: [
      { label: 'ホームに戻る', url: '/' },
      { label: 'お問い合わせ', url: '/contact' },
    ],
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
