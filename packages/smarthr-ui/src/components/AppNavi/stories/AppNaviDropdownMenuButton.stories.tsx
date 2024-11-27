import React from 'react'

import { backgroundColor } from '../../../themes'
import { AnchorButton, Button } from '../../Button'
import { AppNaviDropdownMenuButton } from '../AppNaviDropdownMenuButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/AppNavi/AppNaviDropdownMenuButton',
  component: AppNaviDropdownMenuButton,
  render: (args) => (
    <AppNaviDropdownMenuButton {...args}>
      <Button>ボタン</Button>
      <AnchorButton href="#">アンカーボタン</AnchorButton>
    </AppNaviDropdownMenuButton>
  ),
  args: {
    label: 'ボタン',
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['Template'],
} satisfies Meta<typeof AppNaviDropdownMenuButton>

export const Playground: StoryObj<typeof AppNaviDropdownMenuButton> = {}

export const Current: StoryObj<typeof AppNaviDropdownMenuButton> = {
  name: 'current',
  render: (args) => (
    <AppNaviDropdownMenuButton {...args}>
      <Button aria-current="page">ボタン</Button>
      <AnchorButton href="#">アンカーボタン</AnchorButton>
    </AppNaviDropdownMenuButton>
  ),
}
