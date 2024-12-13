import React from 'react'

import { Table } from '../Table'
import { Td } from '../Td'
import { TdCheckbox } from '../TdCheckbox'

import type { Meta, StoryFn, StoryObj } from '@storybook/react'

const Template: StoryFn<typeof TdCheckbox> = (args) => (
  <Table>
    <tbody>
      <tr>
        <TdCheckbox {...args} />
      </tr>
    </tbody>
  </Table>
)

export default {
  title: 'Data Display（データ表示）/Table/TdCheckbox',
  component: TdCheckbox,
  render: Template,
  argTypes: {
    checked: { control: 'boolean' },
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} satisfies Meta<typeof TdCheckbox>

export const Playground: StoryObj<typeof TdCheckbox> = {}

export const AriaLabelledBy: StoryObj<typeof TdCheckbox> = {
  name: 'aria-labelledby',
  render: (args) => (
    <Table>
      <tbody>
        <tr>
          <TdCheckbox {...args} aria-labelledby="label-name" vAlign="baseline" />
          <Td id="label-name">ラベル名</Td>
        </tr>
      </tbody>
    </Table>
  ),
}

export const Checked: StoryObj<typeof TdCheckbox> = {
  name: 'checked',
  args: {
    checked: true,
  },
}

export const Mixed: StoryObj<typeof TdCheckbox> = {
  name: 'mixed',
  args: {
    checked: true,
    mixed: true,
  },
}

export const Error: StoryObj<typeof TdCheckbox> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const VAlign: StoryObj<typeof TdCheckbox> = {
  name: 'vAlign',
  render: (args) => (
    <Table>
      <tbody>
        <tr className="shr-h-[4em]">
          <TdCheckbox {...args} />
          <TdCheckbox {...args} vAlign="middle" />
          <TdCheckbox {...args} vAlign="baseline" />
        </tr>
      </tbody>
    </Table>
  ),
}
