import React from 'react'

import { Button } from '../../Button'
import { Header } from '../Header'
import { HeaderDropdownMenuButton } from '../HeaderDropdownMenuButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/Header/HeaderDropdownMenuButton',
  component: HeaderDropdownMenuButton,
  render: (args) => (
    <Header>
      <HeaderDropdownMenuButton {...args}>
        <Button>ボタン</Button>
      </HeaderDropdownMenuButton>
    </Header>
  ),
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: 'ボタン',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof HeaderDropdownMenuButton>

export const Playground: StoryObj<typeof HeaderDropdownMenuButton> = {
  args: {},
}
