import { Stack } from '../Stack'

import { GapStory } from './Stack.stories'

import type { Meta } from '@storybook/react-vite'

export default {
  title: 'Components/Layout/Stack/VRT',
  component: Stack,
  render: GapStory.render,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Stack>

export const VRT = {}
