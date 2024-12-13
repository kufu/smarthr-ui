import React from 'react'

import { Text } from '../../Text'
import { Table } from '../Table'
import { TableReel } from '../TableReel'
import { Td } from '../Td'
import { Th } from '../Th'

import type { Meta, StoryFn, StoryObj } from '@storybook/react'

const Template: StoryFn<typeof TableReel> = (args) => (
  <TableReel {...args} className="shr-w-[50vw]">
    <Table>
      <thead>
        <tr>
          {[...Array(10)].map((_, i) => (
            <Th key={i}>
              <Text whiteSpace="nowrap">表頭{i + 1}</Text>
            </Th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {[...Array(10)].map((_, i) => (
            <Td key={i}>
              <Text whiteSpace="nowrap">表データ{i + 1}</Text>
            </Td>
          ))}
        </tr>
      </tbody>
    </Table>
  </TableReel>
)

export default {
  title: 'Data Display（データ表示）/Table/TableReel',
  component: TableReel,
  render: Template,
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof TableReel>

export const Playground: StoryObj<typeof TableReel> = {}
