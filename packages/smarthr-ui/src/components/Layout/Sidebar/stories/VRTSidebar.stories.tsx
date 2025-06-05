import { Meta } from '@storybook/react'
import { Sidebar, Stack } from '../../../..'

import { GapStory, Align as AlignStory } from './Sidebar.stories'

export default {
  title: 'Components/Sidebar/VRT',
  component: Sidebar,
  render: (args, context) => (
    <Stack>
      <div>{GapStory.render && GapStory.render({ ...args, right: true }, context)}</div>
      <div>{AlignStory.render && AlignStory.render(args, context)}</div>
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Sidebar>

export const VRT = {}
