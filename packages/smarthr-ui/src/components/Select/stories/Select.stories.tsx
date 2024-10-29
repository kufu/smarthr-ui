import { action } from '@storybook/addon-actions'
import React from 'react'

import { Stack } from '../../Layout'
import { Select } from '../Select'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/Select',
  component: Select,
  // eslint-disable-next-line smarthr/a11y-input-in-form-control
  render: (args) => <Select {...args} />,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    options: [...Array(2)].map((_, i) => ({ label: `選択肢${i + 1}`, value: `${i + 1}` })),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} satisfies Meta<typeof Select>

export const Playground: StoryObj<typeof Select> = {
  args: {},
}

export const Options: StoryObj<typeof Select> = {
  name: 'options',
  args: {
    options: [
      { label: '選択肢1', value: '1' },
      { label: '選択肢2', value: '2', disabled: true },
      {
        label: '選択肢3',
        options: [
          { label: '選択肢3-1', value: '3-1' },
          { label: '選択肢3-2', value: '3-2', disabled: true },
          { label: '選択肢3-3', value: '3-3', selected: true },
        ],
      },
      { label: '選択肢4', value: '5' },
    ],
  },
}

export const Disabled: StoryObj<typeof Select> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Error: StoryObj<typeof Select> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Width: StoryObj<typeof Select> = {
  name: 'width',
  render: (args) => (
    <Stack align="flex-start">
      {['15em', '50%', 200].map((width) => (
        // eslint-disable-next-line smarthr/a11y-input-in-form-control
        <Select {...args} width={width} key={width} />
      ))}
    </Stack>
  ),
}

export const Size: StoryObj<typeof Select> = {
  name: 'size',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, 'default', 's'].map((size) => (
        // eslint-disable-next-line smarthr/a11y-input-in-form-control
        <Select {...args} size={size as any} key={size} />
      ))}
    </Stack>
  ),
}

export const HasBlank: StoryObj<typeof Select> = {
  name: 'hasBlank',
  args: {
    hasBlank: true,
  },
}

export const Handlers: StoryObj<typeof Select> = {
  name: 'handlers',
  args: {
    onChange: action('change'),
    onChangeValue: action('change value'),
  },
}
