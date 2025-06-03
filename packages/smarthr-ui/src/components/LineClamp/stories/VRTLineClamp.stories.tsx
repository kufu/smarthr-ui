import { Meta, StoryObj } from '@storybook/react'
import { LineClamp } from '../LineClamp'
import { MaxLines } from './LineClamp.stories'

export default {
  title: 'Components/LineClamp/VRT',
  render: MaxLines.render,
  parameters: {
    viewport: {
      defaultViewport: 'vrtMobile',
    },
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
