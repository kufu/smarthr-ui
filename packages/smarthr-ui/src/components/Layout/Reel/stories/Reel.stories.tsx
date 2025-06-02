import { Meta, StoryObj } from '@storybook/react'

import { Reel } from '..'
import { Gap } from '../../../../types'
import { ColorBox } from '../../ComponentsForStories'
import { Stack } from '../../Stack'

const meta = {
  title: 'Layouts（レイアウト）/Reel',
  component: Reel,
  render: (args) => (
    <Reel {...args}>
      {Array.from(Array(20).keys()).map((i) => (
        <ColorBox key={i} />
      ))}
    </Reel>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Reel>
export default meta

export const Playground: StoryObj<typeof Reel> = {}

export const GapStory: StoryObj<typeof Reel> = {
  name: 'gap',
  render: (args) => (
    <Stack>
      {([undefined, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 8] as Gap[]).map((gap) =>
        meta.render({ ...args, gap }),
      )}
    </Stack>
  ),
}

export const Padding: StoryObj<typeof Reel> = {
  name: 'padding',
  render: (args) => (
    <Stack>
      {([undefined, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 8] as Gap[]).map((padding) =>
        meta.render({ ...args, padding }),
      )}
    </Stack>
  ),
}

export const AsStory: StoryObj<typeof Reel> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
