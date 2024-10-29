import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Stack } from '..'
import { Gap } from '../../../../types'
import { Cluster } from '../../Cluster'
import { ColorBox } from '../../ComponentsForStories'

export default {
  title: 'Layouts（レイアウト）/Stack',
  component: Stack,
  render: (args) => (
    <Stack {...args}>
      <ColorBox />
      <ColorBox />
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Stack>

export const Playground: StoryObj<typeof Stack> = {}

export const InlineStory: StoryObj<typeof Stack> = {
  name: 'inline',
  args: {
    inline: true,
  },
}

export const GapStory: StoryObj<typeof Stack> = {
  name: 'gap',
  render: (args) => (
    <Cluster>
      {([0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 8] as Gap[]).map((gap) => (
        <Stack {...args} key={gap} gap={gap}>
          <ColorBox />
          <ColorBox />
          <ColorBox />
          <ColorBox />
        </Stack>
      ))}
    </Cluster>
  ),
}

export const AlignStory: StoryObj<typeof Stack> = {
  name: 'align',
  args: {
    align: 'center',
  },
  render: (args) => {
    type Align =
      | 'center'
      | 'start'
      | 'flex-start'
      | 'end'
      | 'flex-end'
      | 'baseline'
      | 'stretch'
      | undefined
    return (
      <Stack>
        {(['stretch', 'flex-start', 'center', 'flex-end'] as Align[]).map((align) => (
          <Stack {...args} key={align} align={align}>
            <ColorBox />
            <ColorBox narrowWidth narrowHeight />
          </Stack>
        ))}
      </Stack>
    )
  },
}

export const AsStory: StoryObj<typeof Stack> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
