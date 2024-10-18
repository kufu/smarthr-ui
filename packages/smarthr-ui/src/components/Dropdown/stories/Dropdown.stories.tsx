import { action } from '@storybook/addon-actions'
import React from 'react'

import { Button } from '../../Button'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/Dropdown',
  component: Dropdown,
  subcomponents: {
    DropdownTrigger,
    DropdownContent,
    DropdownCloser,
  },
  render: (args) => (
    <Dropdown {...args}>
      <DropdownTrigger>
        <Button>ドロップダウンボタン</Button>
      </DropdownTrigger>
      <DropdownContent>ドロップダウンパネル</DropdownContent>
    </Dropdown>
  ),
  args: {
    onOpen: action('onOpen'),
    onClose: action('onClose'),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Dropdown>

export const DropdownControl: StoryObj<typeof Dropdown> = {
  name: 'Playground',
  args: {},
}
