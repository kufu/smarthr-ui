import { action } from '@storybook/addon-actions'
import React from 'react'

import { Button } from '../../Button'
import { FaThumbtackIcon } from '../../Icon'
import { BottomFixedArea } from '../BottomFixedArea'

import type { Meta, StoryObj } from '@storybook/react'

export const _primaryButtonOptions = {
  なし: undefined,
  あり: <Button variant="primary">プライマリーボタン</Button>,
}

export const _secondaryButtonOptions = {
  なし: undefined,
  あり: <Button>セカンダリーボタン</Button>,
}

export const _tertiaryLinksOptions = {
  なし: undefined,
  あり: [{ text: 'ターシャリーボタン', icon: FaThumbtackIcon, onClick: action('clicked') }],
  複数: [
    { text: 'ターシャリーボタン1', icon: FaThumbtackIcon, onClick: action('clicked1') },
    { text: 'ターシャリーボタン2', icon: FaThumbtackIcon, onClick: action('clicked2') },
  ],
}

export default {
  title: 'Navigation（ナビゲーション）/BottomFixedArea（非推奨）',
  component: BottomFixedArea,
  render: (args) => <BottomFixedArea {...args} />,
  argTypes: {
    description: { control: 'text' },
    primaryButton: {
      control: 'radio',
      options: Object.keys(_primaryButtonOptions),
      mapping: _primaryButtonOptions,
    },
    secondaryButton: {
      control: 'radio',
      options: Object.keys(_secondaryButtonOptions),
      mapping: _secondaryButtonOptions,
    },
    tertiaryLinks: {
      control: 'radio',
      options: Object.keys(_tertiaryLinksOptions),
      mapping: _tertiaryLinksOptions,
    },
  },
  args: {},
  parameters: {
    docs: {
      story: {
        height: '200px',
      },
    },
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['_primaryButtonOptions', '_secondaryButtonOptions', '_tertiaryLinksOptions'],
} satisfies Meta<typeof BottomFixedArea>

export const Playground: StoryObj<typeof BottomFixedArea> = {
  args: {},
}

export const Description: StoryObj<typeof BottomFixedArea> = {
  name: 'description',
  args: {
    description: '領域や操作に対する説明を書けます',
  },
}

export const PrimaryButton: StoryObj<typeof BottomFixedArea> = {
  name: 'primaryButton',
  args: {
    primaryButton: _primaryButtonOptions.あり,
  },
}

export const SecondaryButton: StoryObj<typeof BottomFixedArea> = {
  name: 'secondaryButton',
  args: {
    secondaryButton: _secondaryButtonOptions.あり,
  },
}

export const TertiaryLinks: StoryObj<typeof BottomFixedArea> = {
  name: 'tertiaryLinks',
  args: {
    tertiaryLinks: _tertiaryLinksOptions.複数,
  },
}

export const ZIndex: StoryObj<typeof BottomFixedArea> = {
  name: 'zIndex',
  args: {
    zIndex: 1,
  },
}
