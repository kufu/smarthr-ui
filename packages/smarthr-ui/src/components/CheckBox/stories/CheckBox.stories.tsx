import React from 'react'

import { CheckBox } from '../CheckBox'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/CheckBox',
  component: CheckBox,
  render: (args) => <CheckBox {...args}>CheckBox</CheckBox>,
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof CheckBox>

export const Playground: StoryObj<typeof CheckBox> = {
  args: {},
}

export const Checked: StoryObj<typeof CheckBox> = {
  name: 'checked',
  args: {
    checked: true,
  },
}

export const Disabled: StoryObj<typeof CheckBox> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Mixed: StoryObj<typeof CheckBox> = {
  name: 'mixed',
  args: {
    checked: true,
    mixed: true,
  },
}

export const Error: StoryObj<typeof CheckBox> = {
  name: 'error',
  args: {
    error: true,
  },
}
