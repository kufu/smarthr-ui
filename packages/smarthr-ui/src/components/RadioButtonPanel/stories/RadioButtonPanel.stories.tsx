import React from 'react'

import { RadioButtonPanel } from '../RadioButtonPanel'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/RadioButtonPanel',
  component: RadioButtonPanel,
  // eslint-disable-next-line smarthr/a11y-input-in-form-control
  render: (args) => <RadioButtonPanel {...args} />,
  args: {
    children: 'ラジオボタンパネル',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof RadioButtonPanel>

export const Playground: StoryObj<typeof RadioButtonPanel> = {
  args: {},
}

export const Checked: StoryObj<typeof RadioButtonPanel> = {
  name: 'checked',
  args: {
    checked: true,
  },
}

export const Disabled: StoryObj<typeof RadioButtonPanel> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const As: StoryObj<typeof RadioButtonPanel> = {
  name: 'as',
  args: {
    as: 'span',
  },
}
