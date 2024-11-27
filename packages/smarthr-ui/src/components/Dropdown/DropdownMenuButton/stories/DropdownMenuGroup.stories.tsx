import React from 'react'

import { Button } from '../../../Button'
import { DropdownMenuButton } from '../DropdownMenuButton'
import { DropdownMenuGroup } from '../DropdownMenuGroup'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/DropdownMenuButton/DropdownMenuGroup',
  component: DropdownMenuGroup,
  render: (args) => (
    <DropdownMenuButton label="その他の操作">
      <DropdownMenuGroup {...args} name="グループ1">
        <Button>操作1</Button>
        <Button>操作2</Button>
      </DropdownMenuGroup>
      <Button>操作3</Button>
      <Button>操作4</Button>
      <DropdownMenuGroup {...args} name="グループ2">
        <Button>操作5</Button>
        <Button>操作6</Button>
      </DropdownMenuGroup>
      <DropdownMenuGroup {...args}>
        <Button>操作7</Button>
        <Button>操作8</Button>
      </DropdownMenuGroup>
    </DropdownMenuButton>
  ),
  argTypes: {
    name: { control: 'text' },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DropdownMenuGroup>

export const Playground: StoryObj<typeof DropdownMenuGroup> = {}

export const Name: StoryObj<typeof DropdownMenuGroup> = {
  name: 'name',
  render: (args) => (
    <DropdownMenuButton label="その他の操作">
      <Button>操作1</Button>
      <Button>操作2</Button>
      <DropdownMenuGroup {...args}>
        <Button>操作3</Button>
        <Button>操作4</Button>
      </DropdownMenuGroup>
    </DropdownMenuButton>
  ),
  args: {
    name: 'グループ',
  },
}
