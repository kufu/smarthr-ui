import { IsOpen } from './Dialog.stories'

import type { Dialog } from '../Dialog'
import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/VRT',
  args: {
    width: '40em',
    size: 'M',
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
