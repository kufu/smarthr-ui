/* eslint-disable smarthr/a11y-input-in-form-control */
import { userEvent, within } from '@storybook/test'
import dayjs from 'dayjs'
import React from 'react'

import { DatePicker } from '../DatePicker'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/DatePicker（非推奨）',
  component: DatePicker,
  render: (args) => <DatePicker {...args} />,
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
} satisfies Meta<typeof DatePicker>

export const Playground: StoryObj<typeof DatePicker> = {
  args: {},
}

export const Value: StoryObj<typeof DatePicker> = {
  name: 'value',
  args: {
    value: '2024-11-06',
  },
}

export const Disabled: StoryObj<typeof DatePicker> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const PlaceHolder: StoryObj<typeof DatePicker> = {
  name: 'placeholder',
  args: {
    placeholder: '日付を選択してください',
  },
}

export const Error: StoryObj<typeof DatePicker> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Width: StoryObj<typeof DatePicker> = {
  name: 'width',
  args: {
    width: '500px',
  },
}

export const From: StoryObj<typeof DatePicker> = {
  name: 'from',
  args: {
    from: dayjs().subtract(3, 'day').toDate(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('textbox'))
  },
}

export const To: StoryObj<typeof DatePicker> = {
  name: 'to',
  args: {
    to: dayjs().add(3, 'day').toDate(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('textbox'))
  },
}

export const ParseInput: StoryObj<typeof DatePicker> = {
  name: 'parseInput',
  args: {
    value: '2024年11月06日',
    parseInput: (input) => dayjs(input.replace(/年|月/g, '-').replace(/日/g, '')).toDate(),
  },
}

export const FormatDate: StoryObj<typeof DatePicker> = {
  name: 'formatDate',
  args: {
    formatDate: (date) => dayjs(date).format('YYYY年MM月DD日'),
  },
}

export const ShowAlternative: StoryObj<typeof DatePicker> = {
  name: 'showAlternative',
  args: {
    showAlternative: (date) => {
      const dateSet = ['日', '月', '火', '水', '木', '金', '土']
      return dateSet[dayjs(date).day()]
    },
  },
}
