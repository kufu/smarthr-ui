import { action } from '@storybook/addon-actions'
import React from 'react'

import { backgroundColor } from '../../../themes'
import { FaGearIcon } from '../../Icon'
import { AppNaviButton } from '../AppNaviButton'

import type { Meta, StoryObj } from '@storybook/react'

const _iconOptoins = {
  なし: undefined,
  あり: FaGearIcon,
}

export default {
  title: 'Navigation（ナビゲーション）/AppNavi/AppNaviButton',
  component: AppNaviButton,
  render: (args) => <AppNaviButton {...args} />,
  argTypes: {
    icon: {
      control: 'radio',
      options: Object.keys(_iconOptoins),
      mapping: _iconOptoins,
    },
  },
  args: {
    children: 'ボタン',
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['Template'],
} satisfies Meta<typeof AppNaviButton>

export const Playground: StoryObj<typeof AppNaviButton> = {}

export const Icon: StoryObj<typeof AppNaviButton> = {
  name: 'icon',
  args: {
    icon: _iconOptoins['あり'],
  },
}

export const Current: StoryObj<typeof AppNaviButton> = {
  name: 'current',
  args: {
    current: true,
  },
}

export const OnClick: StoryObj<typeof AppNaviButton> = {
  name: 'onClick',
  args: {
    onClick: action('click'),
  },
}
