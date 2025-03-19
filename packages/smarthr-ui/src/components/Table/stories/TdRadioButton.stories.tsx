import { Table } from '../Table'
import { Td } from '../Td'
import { TdRadioButton } from '../TdRadioButton'

import type { Meta, StoryFn, StoryObj } from '@storybook/react'

const Template: StoryFn<typeof TdRadioButton> = (args) => (
  <Table>
    <tbody>
      <tr>
        <TdRadioButton {...args} />
      </tr>
    </tbody>
  </Table>
)

export default {
  title: 'Data Display（データ表示）/Table/TdRadioButton',
  component: TdRadioButton,
  render: Template,
  argTypes: {
    checked: { control: 'boolean' },
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} satisfies Meta<typeof TdRadioButton>

export const Playground: StoryObj<typeof TdRadioButton> = {}

export const AriaLabelledBy: StoryObj<typeof TdRadioButton> = {
  name: 'aria-labelledby',
  render: (args) => (
    <Table>
      <tbody>
        <tr>
          <TdRadioButton {...args} aria-labelledby="label-name" vAlign="baseline" />
          <Td id="label-name">ラベル名</Td>
        </tr>
      </tbody>
    </Table>
  ),
}

export const Checked: StoryObj<typeof TdRadioButton> = {
  name: 'checked',
  args: {
    checked: true,
  },
}

export const VAlign: StoryObj<typeof TdRadioButton> = {
  name: 'vAlign',
  render: (args) => (
    <Table>
      <tbody>
        <tr className="shr-h-[4em]">
          <TdRadioButton name="vAlign-group" {...args} />
          <TdRadioButton name="vAlign-group" {...args} vAlign="middle" />
          <TdRadioButton name="vAlign-group" {...args} vAlign="baseline" />
        </tr>
      </tbody>
    </Table>
  ),
}
