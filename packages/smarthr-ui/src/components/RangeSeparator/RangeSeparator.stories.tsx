import { Meta, StoryObj } from '@storybook/react'

import { RangeSeparator } from './RangeSeparator'

export default {
  title: 'Components/RangeSeparator',
  component: RangeSeparator,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof RangeSeparator>

export const Playground: StoryObj<typeof RangeSeparator> = {}
