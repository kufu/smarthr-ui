import React from 'react'

import { Chip } from '../../Chip'
import { Text } from '../../Text'
import { Table } from '../Table'
import { TableReel } from '../TableReel'
import { Td } from '../Td'

import type { Meta, StoryFn, StoryObj } from '@storybook/react'

const Template: StoryFn<typeof Td> = (args) => (
  <Table>
    <tbody>
      <tr>
        <Td {...args} />
      </tr>
    </tbody>
  </Table>
)

export default {
  title: 'Data Display（データ表示）/Table/Td',
  component: Td,
  render: Template,
  argTypes: {
    fixed: { description: 'TableReel を組み合わせると機能します。' },
  },
  args: {
    children: '表データ',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} satisfies Meta<typeof Td>

export const Playground: StoryObj<typeof Td> = {}

export const Align: StoryObj<typeof Td> = {
  name: 'align',
  render: (args) => (
    <Table borderType="both">
      <tbody>
        <tr>
          <Td {...args}>align: undefined</Td>
          <Td {...args} align="left">
            align: left
          </Td>
          <Td {...args} align="right">
            align: right
          </Td>
        </tr>
      </tbody>
    </Table>
  ),
}

export const VAlign: StoryObj<typeof Td> = {
  name: 'vAlign',
  render: (args) => (
    <Table>
      <tbody>
        <tr className="shr-h-[4em]">
          <Td {...args}>vAlign: undefined</Td>
          <Td {...args} vAlign="middle">
            vAlign: <Chip>middle</Chip>
          </Td>
          <Td {...args} vAlign="baseline">
            vAlign: <Chip>baseline</Chip>
          </Td>
        </tr>
      </tbody>
    </Table>
  ),
}

export const Nullable: StoryObj<typeof Td> = {
  name: 'nullable',
  args: { nullable: true, children: undefined },
}

export const Fixed: StoryObj<typeof Td> = {
  name: 'fixed',
  render: (args) => (
    <TableReel className="shr-w-[50vw]">
      <Table>
        <tbody>
          <tr>
            {[...Array(20)].map((_, i) => (
              <Td {...args} key={i}>
                <Text whiteSpace="nowrap">表データ{i + 1}</Text>
              </Td>
            ))}
            <Td {...args} fixed>
              <Text whiteSpace="nowrap">fixed: true</Text>
            </Td>
          </tr>
        </tbody>
      </Table>
    </TableReel>
  ),
}

export const ContentWidth: StoryObj<typeof Td> = {
  name: 'contentWidth',
  render: (args) => (
    <Table>
      <tbody>
        <tr>
          <Td {...args} contentWidth={5}>
            表データ1
          </Td>
          <Td {...args} contentWidth="100px">
            表データ2
          </Td>
          <Td contentWidth={{ base: 10, min: 5, max: 20 }}>表データ3</Td>
          <Td>表データ4</Td>
          <Td>表データ5</Td>
        </tr>
      </tbody>
    </Table>
  ),
}
