import React from 'react'

import { BottomFixedArea } from '../BottomFixedArea'

import {
  _primaryButtonOptions,
  _secondaryButtonOptions,
  _tertiaryLinksOptions,
} from './BottomFixedArea.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/BottomFixedArea（非推奨）/VRT',
  render: (args) => <BottomFixedArea {...args} />,
  args: {
    description: '領域や操作に対する説明を書けます。',
    primaryButton: _primaryButtonOptions.あり,
    secondaryButton: _secondaryButtonOptions.あり,
    tertiaryLinks: _tertiaryLinksOptions.複数,
  },
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof BottomFixedArea>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
