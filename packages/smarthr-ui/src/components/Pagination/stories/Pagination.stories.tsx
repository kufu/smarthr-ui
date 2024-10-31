import { action } from '@storybook/addon-actions'
import React from 'react'

import { Stack } from '../../Layout'
import { Pagination } from '../Pagination'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Navigation（ナビゲーション）/Pagination',
  component: Pagination,
  render: (args) => <Pagination {...args} />,
  args: {
    total: 11,
    current: 6,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Pagination>
export default meta

export const Playground: StoryObj<typeof Pagination> = {}

export const Total: StoryObj<typeof Pagination> = {
  name: 'total',
  args: {
    total: 7,
  },
}

export const Current: StoryObj<typeof Pagination> = {
  name: 'current',
  render: (args) => <Stack>{[1, 6, 11].map((current) => meta.render({ ...args, current }))}</Stack>,
}

export const Padding: StoryObj<typeof Pagination> = {
  name: 'padding',
  args: {
    padding: 1,
  },
}

export const WithoutNumbers: StoryObj<typeof Pagination> = {
  name: 'withoutNumbers',
  args: {
    withoutNumbers: true,
  },
}

export const OnClick: StoryObj<typeof Pagination> = {
  name: 'onClick',
  args: {
    onClick: action('click'),
  },
}
