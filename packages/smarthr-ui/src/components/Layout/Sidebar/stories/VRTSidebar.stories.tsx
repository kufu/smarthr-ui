import { Sidebar, Stack } from '../../../..'

import { Align as AlignStory, GapStory } from './Sidebar.stories'

import type { Meta } from '@storybook/react-webpack5'

export default {
  title: 'Components/Layout/Sidebar/VRT',
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
