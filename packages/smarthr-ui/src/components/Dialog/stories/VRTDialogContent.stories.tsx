import { userEvent, within } from 'storybook/test'

import DialogContentStory from './DialogContent.stories'

import type { Dialog } from '../Dialog'
import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  ...DialogContentStory,
  title: 'Components/Dialog/DialogContent/VRT',
  args: {
    width: '40em',
    size: 'M',
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
