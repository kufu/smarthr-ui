import { userEvent } from '@storybook/test'
import React from 'react'

import { Cluster, Stack } from '../Layout'

import { Switch } from './Switch'

import type { Meta, StoryObj } from '@storybook/react/*'

const meta: Meta<typeof Switch> = {
  title: 'Forms（フォーム）/Switch',
  component: Switch,
}

export default meta
type Story = StoryObj<typeof Switch>

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
    <Stack>
      <p>
        <code>:has(:focus-visible)</code> を確かめるための Story です。
      </p>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <Cluster align="center" as="label">
        フォーカスリングを表示
        <Switch />
      </Cluster>
    </Stack>
  ),
}
