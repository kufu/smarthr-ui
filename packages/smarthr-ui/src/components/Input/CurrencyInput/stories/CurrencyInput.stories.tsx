import React from 'react'

import { CurrencyInput } from '../CurrencyInput'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/CurrencyInput',
  component: CurrencyInput,
  // eslint-disable-next-line smarthr/a11y-input-in-form-control
  render: (args) => <CurrencyInput {...args} />,
  args: {
    defaultValue: '999999999',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} as Meta<typeof CurrencyInput>

export const Playground: StoryObj<typeof CurrencyInput> = {}
