import React from 'react'

import { backgroundColor } from '../../../themes'
import { FaGearIcon } from '../../Icon'
import { AppNaviCustomTag } from '../AppNaviCustomTag'

import type { Meta, StoryObj } from '@storybook/react'

const _iconOptoins = {
  なし: undefined,
  あり: FaGearIcon,
}

const Link: React.FC<{
  to: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}> = ({ to, children, disabled = false, className = '', ...props }) => (
  <a {...props} {...(disabled ? {} : { href: to })} className={className}>
    {children}
  </a>
)

export default {
  title: 'Navigation（ナビゲーション）/AppNavi/AppNaviCustomTag',
  component: AppNaviCustomTag,
  render: (args) => <AppNaviCustomTag {...args} />,
  argTypes: {
    icon: {
      control: 'radio',
      options: Object.keys(_iconOptoins),
      mapping: _iconOptoins,
    },
  },
  args: {
    tag: Link,
    children: 'カスタムタグ',
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['Template'],
} satisfies Meta<typeof AppNaviCustomTag>

export const Playground: StoryObj<typeof AppNaviCustomTag> = {}

export const Icon: StoryObj<typeof AppNaviCustomTag> = {
  name: 'icon',
  args: {
    icon: _iconOptoins['あり'],
  },
}

export const Current: StoryObj<typeof AppNaviCustomTag> = {
  name: 'current',
  args: {
    current: true,
  },
}
