import React from 'react'

import { Button } from '../../Button'
import { Dropdown } from '../Dropdown'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/Dropdown/DropdownTrigger',
  component: DropdownTrigger,
  render: (args) => (
    <Dropdown>
      <DropdownTrigger {...args}>
        <Button>ドロップダウンボタン</Button>
      </DropdownTrigger>
      <DropdownContent>ドロップダウンパネル</DropdownContent>
    </Dropdown>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DropdownTrigger>

export const DropdownTriggerControl: StoryObj<typeof DropdownTrigger> = {
  name: 'Playground',
  args: {},
}
