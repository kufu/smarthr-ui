import { Stack } from '../../Layout'
import { BulkActionRow } from '../BulkActionRow'
import { EmptyTableBody } from '../EmptyTableBody'
import { Table } from '../Table'
import { TableReel } from '../TableReel'
import { Td } from '../Td'
import { TdCheckbox } from '../TdCheckbox'
import { Th } from '../Th'
import { ThCheckbox } from '../ThCheckbox'
import { WakuWakuButton } from '../WakuWakuButton'

import type { Meta, StoryFn, StoryObj } from '@storybook/react'

const Template: StoryFn<typeof Table> = (args) => (
  <Table {...args}>
    <thead>
      <tr>
        <Th>オブジェクト名</Th>
        <Th>オブジェクトの情報1</Th>
        <Th>オブジェクトの情報2</Th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <Td>オブジェクト1</Td>
        <Td>情報1</Td>
        <Td>2024-11-26</Td>
      </tr>
    </tbody>
  </Table>
)

export default {
  title: 'Data Display（データ表示）/Table',
  component: Table,
  subcomponents: {
    Th,
    Td,
    ThCheckbox,
    TdCheckbox,
    BulkActionRow,
    EmptyTableBody,
    WakuWakuButton,
    TableReel,
  },
  render: Template,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Table>

export const Playground: StoryObj<typeof Table> = {}

export const BorderType: StoryObj<typeof Table> = {
  name: 'borderType',
  render: (args) => (
    <Stack>
      {[undefined, 'vertical', 'horizontal', 'both', 'outer', 'all'].map((borderType) => (
        <Template {...args} borderType={borderType as any} />
      ))}
    </Stack>
  ),
}

export const BorderStyle: StoryObj<typeof Table> = {
  name: 'borderStyle',
  render: (args) => (
    <Stack>
      {[undefined, 'solid', 'dashed', 'dotted'].map((borderStyle) => (
        <Template {...args} borderStyle={borderStyle as any} />
      ))}
    </Stack>
  ),
}

export const Rounded: StoryObj<typeof Table> = {
  name: 'rounded',
  render: (args) => <Template {...args} rounded />,
}

export const Layout: StoryObj<typeof Table> = {
  name: 'layout',
  render: (args) => (
    <Stack>
      {[undefined, 'auto', 'fixed'].map((layout) => (
        <Template {...args} layout={layout as any} />
      ))}
    </Stack>
  ),
}

export const FixedHead: StoryObj<typeof Table> = {
  name: 'fixedHead',
  render: (args) => (
    <Table {...args}>
      <thead>
        <tr>
          <Th>オブジェクト名</Th>
          <Th>オブジェクトの情報1</Th>
          <Th>オブジェクトの情報2</Th>
        </tr>
      </thead>
      <tbody>
        {[...Array(50)].map((_, i) => (
          <tr key={i}>
            <Td>オブジェクト{i + 1}</Td>
            <Td>情報{i + 1}</Td>
            <Td>2024-11-26</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
  args: { fixedHead: true },
}
