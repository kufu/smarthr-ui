import React from 'react'
import { Meta, StoryObj } from '@storybook/react/*'

import { AppHeader } from '../AppHeader'

import { args } from './args'
import { IntlProvider } from '../../../intl'

const meta = {
  title: 'Navigation（ナビゲーション）/AppHeader',
  component: AppHeader,
  render: (args) => (
    <IntlProvider locale="ja">
      <AppHeader {...args} />
    </IntlProvider>
  ),
  args,
} satisfies Meta<typeof AppHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
