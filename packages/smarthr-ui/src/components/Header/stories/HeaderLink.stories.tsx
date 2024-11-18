import React from 'react'

import { backgroundColor } from '../../../themes'
import { FaRegCircleQuestionIcon } from '../../Icon'
import { HeaderLink } from '../HeaderLink'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/Header/HeaderLink',
  component: HeaderLink,
  render: (args) => <HeaderLink {...args}>ヘルプ</HeaderLink>,
  args: {
    href: '#',
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.brand }],
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof HeaderLink>

export const Playground: StoryObj<typeof HeaderLink> = {
  args: {},
}

export const Prefix: StoryObj<typeof HeaderLink> = {
  name: 'prefix',
  args: {
    prefix: <FaRegCircleQuestionIcon />,
  },
}

export const EnableNew: StoryObj<typeof HeaderLink> = {
  name: 'enableNew',
  render: (args) => <HeaderLink {...args}>ヘルプ</HeaderLink>,
  args: {
    prefix: <FaRegCircleQuestionIcon />,
    enableNew: true,
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
  },
}
