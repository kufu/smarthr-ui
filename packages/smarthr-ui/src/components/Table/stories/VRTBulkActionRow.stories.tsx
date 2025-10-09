import { BulkActionRow } from '../BulkActionRow'
import { Table } from '../Table'
import { Th } from '../Th'

import type { Meta } from '@storybook/react'

export default {
  title: 'Components/Table/BulkActionRow/VRT',
  render: (args) => (
    <Table>
      <thead>
        <tr>
          <Th rowSpan={2}>氏名</Th>
          <Th colSpan={2}>詳細情報</Th>
          <Th rowSpan={2}>アクション</Th>
        </tr>
        <tr>
          <Th>年齢</Th>
          <Th>部署</Th>
        </tr>
        <BulkActionRow {...args}>一括操作領域</BulkActionRow>
      </thead>
    </Table>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
    pseudo: {
      focusVisible: ['#focus-visible .smarthr-ui-Switch'],
    },
  },
  tags: ['!autodocs'],
} as Meta<typeof BulkActionRow>

export const VRT = {}

export const VRTMultiRowsHeader = {
  ...VRT,
}
