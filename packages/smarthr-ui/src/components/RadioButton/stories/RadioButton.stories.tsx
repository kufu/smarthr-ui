import React from 'react'

import { RadioButton } from '../RadioButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/RadioButton',
  component: RadioButton,
  // eslint-disable-next-line smarthr/a11y-input-in-form-control
  render: (args) => <RadioButton {...args} />,
  args: {
    children: 'ラジオボタン',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof RadioButton>

export const Playground: StoryObj<typeof RadioButton> = {
  args: {},
}

export const Checked: StoryObj<typeof RadioButton> = {
  name: 'checked',
  args: {
    checked: true,
  },
}

export const Disabled: StoryObj<typeof RadioButton> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}
