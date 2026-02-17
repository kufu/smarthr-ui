import { Stack } from '../../Layout'
import { Text } from '../../Text'
import { BulkActionRow } from '../BulkActionRow'
import { EmptyTableBody } from '../EmptyTableBody'
import { Table } from '../Table'
import { Td } from '../Td'
import { TdCheckbox } from '../TdCheckbox'
import { Th } from '../Th'
import { ThCheckbox } from '../ThCheckbox'
import { WakuWakuButton } from '../WakuWakuButton'

import type { Meta, StoryFn, StoryObj } from '@storybook/react-webpack5'

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
  title: 'Components/Table',
  component: Table,
  subcomponents: {
    Th,
    Td,
    ThCheckbox,
    TdCheckbox,
    BulkActionRow,
    EmptyTableBody,
    WakuWakuButton,
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
        <Template {...args} key={borderType || 'undefined'} borderType={borderType as any} />
      ))}
    </Stack>
  ),
}

export const BorderStyle: StoryObj<typeof Table> = {
  name: 'borderStyle',
  render: (args) => (
    <Stack>
      {[undefined, 'solid', 'dashed', 'dotted'].map((borderStyle) => (
        <Template {...args} key={borderStyle || 'undefined'} borderStyle={borderStyle as any} />
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
        <Template {...args} key={layout || 'undefined'} layout={layout as any} />
      ))}
    </Stack>
  ),
}

export const FixedHead: StoryObj<typeof Table> = {
  name: 'fixedHead',
  decorators: [
    (Story) => (
      <div style={{ height: '60vh' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Table {...args}>
      <thead>
        <tr>
          <ThCheckbox name="check" key={0} />
          <Th>
            <Text whiteSpace="nowrap">オブジェクト名</Text>
          </Th>
          <Th>
            <Text whiteSpace="nowrap">オブジェクトの情報1</Text>
          </Th>
          <Th>
            <Text whiteSpace="nowrap">オブジェクトの情報2</Text>
          </Th>
        </tr>
      </thead>
      <tbody>
        {[...Array(20)].map((_, i) => (
          <tr key={i}>
            <TdCheckbox name={`test-check${i + 1}`} aria-labelledby="check" key={0} />
            <Td>
              <Text whiteSpace="nowrap">オブジェクト{i + 1}</Text>
            </Td>
            <Td>
              <Text whiteSpace="nowrap">情報{i + 1}</Text>
            </Td>
            <Td>
              <Text whiteSpace="nowrap">2024-11-26</Text>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
  args: { fixedHead: true },
}

export const Reel: StoryObj<typeof Table> = {
  name: 'reel',
  decorators: [
    (Story) => (
      <div className="shr-w-[50vw]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Table {...args}>
      <thead>
        <tr>
          <Th key={0} fixed="left">
            <Text whiteSpace="nowrap">表頭{0}</Text>
          </Th>
          {[...Array(9)].map((_, i) => (
            <Th key={i + 1}>
              <Text whiteSpace="nowrap">表頭{i + 1}</Text>
            </Th>
          ))}
          <Th key={10} fixed="right">
            <Text whiteSpace="nowrap">表頭{10}</Text>
          </Th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Td fixed="left" key={0}>
            <Text whiteSpace="nowrap">表データ{0}</Text>
          </Td>
          {[...Array(9)].map((_, i) => (
            <Td key={i + 1}>
              <Text whiteSpace="nowrap">表データ{i + 1}</Text>
            </Td>
          ))}
          <Td fixed="right" key={10}>
            <Text whiteSpace="nowrap">表データ{10}</Text>
          </Td>
        </tr>
      </tbody>
    </Table>
  ),
  args: { reel: true },
}
