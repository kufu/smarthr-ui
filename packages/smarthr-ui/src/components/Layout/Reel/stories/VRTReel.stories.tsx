import { Reel } from '../../../..'

import { GapStory, Padding } from './Reel.stories'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Layout/Reel/VRT',
  component: Reel,
  render: (args, context) => (
    <>
      {GapStory.render && GapStory.render(args, context)}
      {Padding.render && Padding.render(args, context)}
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Reel>

export const VRT: StoryObj<typeof Reel> = {}
