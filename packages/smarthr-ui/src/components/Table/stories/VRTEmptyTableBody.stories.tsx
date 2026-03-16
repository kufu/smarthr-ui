import { EmptyTableBody } from '../EmptyTableBody'
import { Table } from '../Table'
import { Th } from '../Th'

import type { Meta } from '@storybook/react-webpack5'

export default {
  title: 'Components/Table/EmptyTableBody/VRT',
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
      </thead>
      <EmptyTableBody {...args}>
        <p>該当するオブジェクトはありません。</p>
        <p>別の条件を試してください。</p>
      </EmptyTableBody>
    </Table>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
    pseudo: {
      focusVisible: ['#focus-visible .smarthr-ui-Switch'],
    },
  },
  tags: ['!autodocs'],
} as Meta<typeof EmptyTableBody>

export const VRT = {}

export const VRTMultiRowsHeader = {
  ...VRT,
}
