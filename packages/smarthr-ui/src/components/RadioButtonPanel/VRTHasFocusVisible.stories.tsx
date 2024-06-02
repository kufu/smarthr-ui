import { userEvent } from '@storybook/test'
import React from 'react'

import { RadioButtonPanel } from './RadioButtonPanel'

import type { Meta, StoryObj } from '@storybook/react/*'

const meta: Meta<typeof RadioButtonPanel> = {
  title: 'Forms（フォーム）/RadioButtonPanel',
  component: RadioButtonPanel,
}

export default meta
type Story = StoryObj<typeof RadioButtonPanel>

export const HasFocusVisible: Story = {
  parameters: {
    chromatic: {
      delay: 200,
    },
  },
  play: async () => {
    userEvent.keyboard('{tab}', { delay: 100 })
  },
  render: () => (
    // eslint-disable-next-line smarthr/a11y-input-in-form-control
    <RadioButtonPanel name="has_focus_visible">
      <code>:has(:focus-visible)</code> を確かめるための Story です。
    </RadioButtonPanel>
  ),
}
