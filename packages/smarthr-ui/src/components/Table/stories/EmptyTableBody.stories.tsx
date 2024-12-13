import React from 'react'

import { Stack } from '../../Layout'
import { EmptyTableBody } from '../EmptyTableBody'
import { Table } from '../Table'
import { Th } from '../Th'

import type { Meta, StoryFn, StoryObj } from '@storybook/react'

const Template: StoryFn<typeof EmptyTableBody> = ({ children, ...args }) => (
  <Table>
    <thead>
      <tr>
        <Th>表頭1</Th>
        <Th>表頭2</Th>
        <Th>表頭3</Th>
      </tr>
    </thead>
    <EmptyTableBody {...args}>
      {children ?? (
        <>
          <p>該当するオブジェクトはありません。</p>
          <p>別の条件を試してください。</p>
        </>
      )}
    </EmptyTableBody>
  </Table>
)

export default {
  title: 'Data Display（データ表示）/Table/EmptyTableBody',
  component: EmptyTableBody,
  render: Template,
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof EmptyTableBody>

export const Playground: StoryObj<typeof EmptyTableBody> = {}

export const Padding: StoryObj<typeof EmptyTableBody> = {
  render: (args) => (
    <Stack>
      {[undefined, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 8].map((padding) => (
        <Template {...args} padding={padding as any} key={padding}>
          <p>padding: {padding}</p>
        </Template>
      ))}
    </Stack>
  ),
}
