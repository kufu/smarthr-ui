import { Text } from '../../Text'
import { SpreadsheetTable } from '../SpreadsheetTable'

import type { Meta, StoryObj } from '@storybook/react'
import { SpreadsheetTableCorner } from '../SpreadsheetTableCorner'

export default {
  title: 'Components/SpreadsheetTable',
  component: SpreadsheetTable,
  render: (args) => <SpreadsheetTable {...args} />,
  args: {
    data: [
      ['A1', 'B1', 'C1'],
      ['A2', 'B2', 'C2'],
    ],
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SpreadsheetTable>

export const Playground: StoryObj<typeof SpreadsheetTable> = {}

export const Data: StoryObj<typeof SpreadsheetTable> = {
  name: 'data',
  args: {
    data: [
      ['社員番号', '氏名', '部署1', '部署2', '部署3', '1次評価者', '最終評価者', '評価共有者'],
      [
        '001',
        <>
          草野 栄一郎
          <Text size="S" emphasis>
            （ここを修正してください）
          </Text>
        </>,
        '人事部',
        '',
        '',
        '岩下 香澄',
        '岩下 香澄',
        '岩下 香澄',
      ],
    ],
  },
}

export const Children: StoryObj<typeof SpreadsheetTable> = {
  name: 'children',
  args: {
    data: undefined,
    children: (
      <>
        <thead>
          <tr>
            <SpreadsheetTableCorner />
            <th>A</th>
            <th>B</th>
            <th>C</th>
            <th>D</th>
            <th>E</th>
            <th>F</th>
            <th>G</th>
            <th>H</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1</th>
            <td>社員番号</td>
            <td>氏名</td>
            <td>部署1</td>
            <td>部署2</td>
            <td>部署3</td>
            <td>1次評価者</td>
            <td>最終評価者</td>
            <td>評価共有者</td>
          </tr>
          <tr>
            <th>2</th>
            <td>001</td>
            <td>
              草野 栄一郎
              <Text size="S" emphasis>
                （ここを修正してください）
              </Text>
            </td>
            <td>人事部</td>
            <td></td>
            <td></td>
            <td>岩下 香澄</td>
            <td>島袋 月代</td>
            <td>永山 侑太郎</td>
          </tr>
          <tr>
            <th>3</th>
            <td>002</td>
            <td>上原 玲子</td>
            <td>総務部</td>
            <td></td>
            <td></td>
            <td>003:大和 真</td>
            <td>004:大和 真</td>
            <td>松原 英太</td>
          </tr>
        </tbody>
      </>
    ),
  },
}
