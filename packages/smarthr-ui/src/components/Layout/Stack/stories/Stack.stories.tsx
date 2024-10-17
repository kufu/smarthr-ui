import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Stack } from '..'
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

export const Inline: StoryObj<typeof Stack> = {
  name: 'inline',
  args: {
    inline: true,
  },
}

export const Gap: StoryObj<typeof Stack> = {
  name: 'gap',
  render: (args) => (
    <Cluster>
      <Stack {...args} gap={0.25}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={0.5}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={0.75}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={1}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={1.25}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={1.5}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={2}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={2.5}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={3}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={4}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={8}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
    </Cluster>
  ),
}

export const Align: StoryObj<typeof Stack> = {
  name: 'align',
  args: {
    align: 'center',
  },
}

export const As: StoryObj<typeof Stack> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
