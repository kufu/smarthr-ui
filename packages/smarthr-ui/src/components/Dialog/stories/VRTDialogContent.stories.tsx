import { userEvent, within } from '@storybook/test'

import { Dialog } from '../Dialog'

import DialogContentStory from './DialogContent.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  ...DialogContentStory,
  title: 'Dialog（ダイアログ）/Dialog/DialogContent/VRT',
  args: {
    width: '40em',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByRole('button')
    userEvent.click(trigger)
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Dialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof Dialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
