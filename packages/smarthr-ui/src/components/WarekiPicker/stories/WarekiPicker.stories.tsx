/* eslint-disable smarthr/a11y-input-in-form-control */
import { userEvent, within } from '@storybook/test'
import dayjs from 'dayjs'
import React from 'react'

import { WarekiPicker } from '../WarekiPicker'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/WarekiPicker',
  component: WarekiPicker,
  render: (args) => <WarekiPicker {...args} />,
  args: {},
  argTypes: {
    value: {
      control: 'text',
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} satisfies Meta<typeof WarekiPicker>

export const Playground: StoryObj<typeof WarekiPicker> = {
  args: {},
}

export const Value: StoryObj<typeof WarekiPicker> = {
  name: 'value',
  args: {
    value: '2024-11-06',
  },
}

export const Disabled: StoryObj<typeof WarekiPicker> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const PlaceHolder: StoryObj<typeof WarekiPicker> = {
  name: 'placeholder',
  args: {
    placeholder: '日付を選択してください',
  },
}

export const Error: StoryObj<typeof WarekiPicker> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Width: StoryObj<typeof WarekiPicker> = {
  name: 'width',
  args: {
    width: '500px',
  },
}

export const From: StoryObj<typeof WarekiPicker> = {
  name: 'from',
  args: {
    from: dayjs().subtract(3, 'day').toDate(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('textbox'))
  },
}

export const To: StoryObj<typeof WarekiPicker> = {
  name: 'to',
  args: {
    to: dayjs().add(3, 'day').toDate(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('textbox'))
  },
}

export const ParseInput: StoryObj<typeof WarekiPicker> = {
  name: 'parseInput',
  args: {
    value: '2024年11月06日',
    parseInput: (input) => dayjs(input.replace(/年|月/g, '-').replace(/日/g, '')).toDate(),
  },
}

export const FormatDate: StoryObj<typeof WarekiPicker> = {
  name: 'formatDate',
  args: {
    formatDate: (date) => dayjs(date).format('YYYY年MM月DD日'),
  },
}
