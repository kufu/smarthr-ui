import { userEvent, within } from 'storybook/test'

import { Button } from '../../Button'
import { Dropdown } from '../Dropdown'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Dropdown/VRT',
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
    await userEvent.click(button)

    // DropdownContentはrequestAnimationFrame経由でフォーカスを当てるため、
    // スナップショット撮影前にその発火を待つ
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    })
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
