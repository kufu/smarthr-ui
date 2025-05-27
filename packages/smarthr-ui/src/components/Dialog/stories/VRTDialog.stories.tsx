import { Dialog } from '../Dialog'

import { IsOpen } from './Dialog.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Dialog（ダイアログ）/Dialog/VRT',
  args: {
    width: '40em',
    isOpen: true,
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Dialog>

export const VRT = IsOpen

export const VRTForcedColors: StoryObj<typeof Dialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
