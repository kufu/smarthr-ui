import { userEvent, within } from '@storybook/test'
import dayjs from 'dayjs'
import React from 'react'

import { Cluster } from '../../Layout'
import { Calendar } from '../Calendar'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Calendar/VRT',
  render: (args) => (
    <Cluster gap="S">
      <Calendar value={dayjs('2024/10/06').toDate()} onSelectDate={args.onSelectDate} />
      <Calendar
        from={dayjs('2024/10/03').toDate()}
        value={dayjs('2024/10/06').toDate()}
        to={dayjs('2024/10/09').toDate()}
        onSelectDate={args.onSelectDate}
      />
      <Calendar
        from={dayjs('2010/10/03').toDate()}
        value={dayjs('2020/10/06').toDate()}
        to={dayjs('2022/10/09').toDate()}
        onSelectDate={args.onSelectDate}
      />
    </Cluster>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getAllByText('年を選択する')[2])
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Calendar>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof Calendar> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

export const VRTFocusVisible: StoryObj<typeof Calendar> = {
  ...VRT,
  render: (args) => (
    <Calendar
      from={dayjs('2024/10/03').toDate()}
      value={dayjs('2024/10/06').toDate()}
      to={dayjs('2024/10/09').toDate()}
      onSelectDate={args.onSelectDate}
    />
  ),
  parameters: {
    pseudo: {
      focusVisible: ['button'],
    },
  },
}

export const VRTFocusVisibleForcedColors: StoryObj<typeof Calendar> = {
  ...VRTFocusVisible,
  parameters: {
    pseudo: {
      focusVisible: ['button'],
    },
    chromatic: { forcedColors: 'active' },
  },
}
