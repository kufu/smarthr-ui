import React from 'react'

import { Stack } from '../../Layout'
import { UpwardLink } from '../UpwardLink'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/UpwardLink/VRT',
  render: (args) => (
    <Stack>
      {[undefined, true, false].map((indent, i) => (
        <div key={i}>
          <UpwardLink {...args} indent={indent} />
        </div>
      ))}
    </Stack>
  ),
  args: {
    href: '#',
    children: '一覧に戻る',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof UpwardLink>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
