import React from 'react'

import { Table } from '../Table'
import { ThCheckbox } from '../ThCheckbox'

import type { Meta, StoryFn, StoryObj } from '@storybook/react'

const Template: StoryFn<typeof ThCheckbox> = (args) => (
  <Table>
    <thead>
      <tr>
        <ThCheckbox {...args} />
      </tr>
    </thead>
  </Table>
)

export default {
  title: 'Data Display（データ表示）/Table/ThCheckbox',
  component: ThCheckbox,
  render: Template,
  argTypes: {
    checked: { control: 'boolean' },
    decorators: { control: false },
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} satisfies Meta<typeof ThCheckbox>

export const Playground: StoryObj<typeof ThCheckbox> = {}

export const Checked: StoryObj<typeof ThCheckbox> = {
  name: 'checked',
  args: {
    checked: true,
  },
}

export const Mixed: StoryObj<typeof ThCheckbox> = {
  name: 'mixed',
  args: {
    checked: true,
    mixed: true,
  },
}

export const Error: StoryObj<typeof ThCheckbox> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const VAlign: StoryObj<typeof ThCheckbox> = {
  name: 'vAlign',
  render: (args) => (
    <Table>
      <thead>
        <tr className="shr-h-[4em]">
          <ThCheckbox {...args} />
          <ThCheckbox {...args} vAlign="middle" />
          <ThCheckbox {...args} vAlign="baseline" />
          <ThCheckbox {...args} vAlign="bottom" />
        </tr>
      </thead>
    </Table>
  ),
}
