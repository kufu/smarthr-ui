import Story from './RequiredLabel.stories'

import type { RequiredLabel } from '../RequiredLabel'
import type { Meta } from '@storybook/react-vite'

export default {
  title: 'Components/StatusLabel/RequiredLabel/VRT',
  render: Story.render,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof RequiredLabel>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
