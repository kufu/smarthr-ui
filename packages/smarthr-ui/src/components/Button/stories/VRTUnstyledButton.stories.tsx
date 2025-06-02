import { UnstyledButton } from '../UnstyledButton'

import type { Meta, StoryObj } from '@storybook/react'

import Story from './UnstyledButton.stories'

export default {
  title: 'Buttons（ボタン）/UnstyledButton/VRT',
  render: Story.render,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof UnstyledButton>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
