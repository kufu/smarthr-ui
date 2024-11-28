import { action } from '@storybook/addon-actions'
import React from 'react'

import { Chip } from '../../Chip'
import { Stack } from '../../Layout'
import { Text } from '../../Text'
import { Table } from '../Table'
import { TableReel } from '../TableReel'
import { Th } from '../Th'

import type { Meta, StoryFn, StoryObj } from '@storybook/react'

const Template: StoryFn<typeof Th> = (args) => (
  <Table>
    <thead>
      <tr>
        <Th {...args}>表頭</Th>
      </tr>
    </thead>
  </Table>
)

export default {
  title: 'Data Display（データ表示）/Table/Th',
  component: Th,
  render: Template,
  argTypes: {
    fixed: { description: 'TableReel を組み合わせると機能します。' },
    decorators: { control: false },
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} satisfies Meta<typeof Th>

export const Playground: StoryObj<typeof Th> = {}

export const Sort: StoryObj<typeof Th> = {
  name: 'sort',
  render: (args) => (
    <Stack>
      <Template {...args} />
      <Template {...args} sort="asc" />
      <Template {...args} sort="desc" />
      <Template {...args} sort="none" />
    </Stack>
  ),
}

export const OnSort: StoryObj<typeof Th> = {
  name: 'onSort',
  render: (args) => <Template {...args} sort="desc" onSort={action('sort')} />,
}

export const ContentWidth: StoryObj<typeof Th> = {
  name: 'contentWidth',
  render: (args) => (
    <Table>
      <thead>
        <tr>
          <Th {...args} contentWidth={5}>
            表頭1
          </Th>
          <Th {...args} contentWidth="100px">
            表頭2
          </Th>
          <Th>表頭3</Th>
          <Th>表頭4</Th>
          <Th>表頭5</Th>
        </tr>
      </thead>
    </Table>
  ),
}

export const Align: StoryObj<typeof Th> = {
  name: 'align',
  render: (args) => (
    <Table borderType="both">
      <thead>
        <tr>
          <Th {...args}>align: undefined</Th>
          <Th {...args} align="left">
            align: left
          </Th>
          <Th {...args} align="right">
            align: right
          </Th>
        </tr>
      </thead>
    </Table>
  ),
}

export const VAlign: StoryObj<typeof Th> = {
  name: 'vAlign',
  render: (args) => (
    <Table>
      <thead>
        <tr className="shr-h-[4em]">
          <Th {...args}>vAlign: undefined</Th>
          <Th {...args} vAlign="middle">
            vAlign: <Chip>middle</Chip>
          </Th>
          <Th {...args} vAlign="baseline">
            vAlign: <Chip>baseline</Chip>
          </Th>
          <Th {...args} vAlign="bottom">
            vAlign: <Chip>bottom</Chip>
          </Th>
        </tr>
      </thead>
    </Table>
  ),
}

export const Fixed: StoryObj<typeof Th> = {
  name: 'fixed',
  render: (args) => (
    <TableReel className="shr-w-[50vw]">
      <Table>
        <thead>
          <tr>
            {[...Array(20)].map((_, i) => (
              <Th {...args} key={i}>
                <Text whiteSpace="nowrap">表頭{i + 1}</Text>
              </Th>
            ))}
            <Th {...args} fixed>
              <Text whiteSpace="nowrap">fixed: true</Text>
            </Th>
          </tr>
        </thead>
      </Table>
    </TableReel>
  ),
}
