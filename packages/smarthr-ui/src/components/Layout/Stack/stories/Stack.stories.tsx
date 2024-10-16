import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Stack } from '..'
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
    withTheming: true,
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
  args: {
    gap: 'XL',
  },
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
