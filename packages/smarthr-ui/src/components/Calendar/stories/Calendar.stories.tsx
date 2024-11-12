import dayjs from 'dayjs'
import React from 'react'

import { Calendar } from '../Calendar'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Calendar',
  component: Calendar,
  // argsType で date を指定した場合、args が Date でなく UnixTime(number) になってしまうため変換する
  // refs: https://github.com/storybookjs/storybook/issues/11822
  render: (args) => (
    <Calendar
      value={args.value ? dayjs(args.value).toDate() : undefined}
      from={args.from ? dayjs(args.from).toDate() : undefined}
      to={args.to ? dayjs(args.to).toDate() : undefined}
      onSelectDate={args.onSelectDate}
    />
  ),
  args: {},
  argTypes: {
    value: {
      control: 'date',
    },
    from: {
      control: 'date',
    },
    to: {
      control: 'date',
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Calendar>

export const Playground: StoryObj<typeof Calendar> = {
  args: {},
}

export const Value: StoryObj<typeof Calendar> = {
  name: 'value',
  args: {
    value: dayjs('2023-06-15').toDate(),
  },
}

export const From: StoryObj<typeof Calendar> = {
  name: 'from',
  args: {
    from: dayjs().subtract(3, 'day').toDate(),
  },
}

export const To: StoryObj<typeof Calendar> = {
  name: 'to',
  args: {
    to: dayjs().add(3, 'day').toDate(),
  },
}
