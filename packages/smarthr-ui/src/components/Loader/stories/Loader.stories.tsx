import React from 'react'

import { Stack } from '../../Layout'
import { Loader } from '../Loader'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'States（状態）/Loader',
  component: Loader,
  render: (args) => <Loader {...args} />,
  args: {},
  argTypes: {
    alt: { control: 'text' },
    text: { control: 'text' },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Loader>

export const Playground: StoryObj<typeof Loader> = {
  args: {},
}

export const Size: StoryObj<typeof Loader> = {
  name: 'size',
  render: (args) => (
    <Stack align="flex-start">
      <Loader {...args} />
      <Loader {...args} size="m" />
      <Loader {...args} size="s" />
    </Stack>
  ),
}

export const Alt: StoryObj<typeof Loader> = {
  name: 'alt',
  render: (args) => <Loader {...args} alt="読込中" />,
}

export const Text: StoryObj<typeof Loader> = {
  name: 'text',
  render: (args) => <Loader {...args} text="読み込んでいます。" />,
}

export const Type: StoryObj<typeof Loader> = {
  name: 'type',
  render: (args) => (
    <Stack align="flex-start">
      <Loader {...args} />
      <Loader {...args} type="primary" />
      <div className="shr-bg-scrim">
        <Loader {...args} type="light" />
      </div>
    </Stack>
  ),
}
