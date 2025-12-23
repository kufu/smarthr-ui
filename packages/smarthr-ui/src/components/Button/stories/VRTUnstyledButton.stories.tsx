import Story from './UnstyledButton.stories'

import type { UnstyledButton } from '../UnstyledButton'
import type { Meta, StoryObj } from '@storybook/react-webpack5'


export default {
  title: 'Components/Button/UnstyledButton/VRT',
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
