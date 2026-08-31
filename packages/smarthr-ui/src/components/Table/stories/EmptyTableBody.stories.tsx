import { Stack } from '../../Layout'
import { Table } from '../Table'
import { Th } from '../Th'
import { EmptyTableBody } from '../client/components'

import type { Meta, StoryFn, StoryObj } from '@storybook/react-webpack5'

const Template: StoryFn<typeof EmptyTableBody> = ({ children, ...rest }) => (
  <Table>
    <thead>
      <tr>
        <Th>表頭1</Th>
        <Th>表頭2</Th>
        <Th>表頭3</Th>
      </tr>
    </thead>
    <EmptyTableBody {...rest}>
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
  title: 'Components/Table/EmptyTableBody',
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
        <Template {...args} key={padding} padding={padding as any}>
          <p>padding: {padding}</p>
        </Template>
      ))}
    </Stack>
  ),
}
