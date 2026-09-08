import { MaxLines } from './LineClamp.stories'

import type { LineClamp } from '../LineClamp'
import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/LineClamp/VRT',
  render: MaxLines.render,
  globals: {
    viewport: { value: 'vrtMobile' },
  },
  parameters: {
    chromatic: {
      modes: {
        vrtMobile: { viewport: 'vrtMobile' },
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof LineClamp>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
