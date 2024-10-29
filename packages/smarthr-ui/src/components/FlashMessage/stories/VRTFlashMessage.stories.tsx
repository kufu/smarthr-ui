import { FlashMessage } from '../FlashMessage'

import { Type } from './FlashMessage.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'States（状態）/FlashMessage（非推奨）/VRT',
  render: Type.render,
  args: {
    visible: true,
    animation: 'none',
    // Story 上で左上に表示するための記述です
    className: 'shr-sticky shr-inline-flex',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof FlashMessage>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
