import { Stack } from '../../../..'

import { GapStory } from './Stack.stories'

import type { Meta } from '@storybook/react-webpack5'

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
