import React from 'react'

import { BulkActionRow } from '../BulkActionRow'
import { Table } from '../Table'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Table/BulkActionRow',
  component: BulkActionRow,
  render: (args) => (
    <Table>
      <thead>
        <BulkActionRow {...args}>一括操作領域</BulkActionRow>
      </thead>
    </Table>
  ),
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof BulkActionRow>

export const Playground: StoryObj<typeof BulkActionRow> = {}
