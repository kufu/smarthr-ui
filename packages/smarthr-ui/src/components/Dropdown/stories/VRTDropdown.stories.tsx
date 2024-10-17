import { userEvent, within } from '@storybook/test'
import React from 'react'

import { Button } from '../../Button'
import { Dropdown } from '../Dropdown'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/Dropdown/VRT',
  render: (args) => (
    <Dropdown {...args}>
      <DropdownTrigger>
        <Button>ドロップダウンボタン</Button>
      </DropdownTrigger>
      <DropdownContent>ドロップダウンパネル</DropdownContent>
    </Dropdown>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = await canvas.findByRole('button')
    userEvent.click(button)
  },
  tags: ['!autodocs'],
} as Meta<typeof Dropdown>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
