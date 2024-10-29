import { Meta } from '@storybook/react'

import { Stack } from '../../../..'

import { GapStory } from './Stack.stories'

export default {
  title: 'Layouts（レイアウト）/Stack/VRT',
  component: Stack,
  render: GapStory.render,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Stack>

export const VRT = {}
