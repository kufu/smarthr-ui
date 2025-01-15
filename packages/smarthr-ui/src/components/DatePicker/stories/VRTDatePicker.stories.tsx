/* eslint-disable smarthr/a11y-input-has-name-attribute */
/* eslint-disable smarthr/a11y-prohibit-input-placeholder */
/* eslint-disable smarthr/a11y-input-in-form-control */
import { userEvent, within } from '@storybook/test'
import dayjs from 'dayjs'
import React from 'react'

import { Cluster } from '../../Layout'
import { DatePicker } from '../DatePicker'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/DatePicker（非推奨）/VRT',
  component: DatePicker,
  render: (args) => {
    const value = '2024/11/06'
    const placeholder = '日付を入力してください'
    const width = '100%'
    const showAlternative = (_: Date | null) => <div>alt</div>
    const formatDate = (date: Date | null) => dayjs(date).format('YYYY年MM月DD')

    const matrics = [
      { error: false, disabled: false },
      { error: false, disabled: true },
      { error: true, disabled: false },
      { error: true, disabled: true },
    ]

    return (
      <Cluster>
        {matrics.map((m) => (
          <>
            <DatePicker {...args} error={m.error} disabled={m.disabled} />
            <DatePicker error={m.error} disabled={m.disabled} placeholder={placeholder} />
            <DatePicker error={m.error} disabled={m.disabled} value={value} />
            <DatePicker error={m.error} disabled={m.disabled} width={width} />
            <DatePicker
              error={m.error}
              disabled={m.disabled}
              value={value}
              showAlternative={showAlternative}
            />
            <DatePicker
              error={m.error}
              disabled={m.disabled}
              value={value}
              formatDate={formatDate}
            />
          </>
        ))}
      </Cluster>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs', 'skip-test-runner'],
} satisfies Meta<typeof DatePicker>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

export const VRTExpanded: StoryObj = {
  render: (args) => <DatePicker {...args} className="shr-min-w-[500px] shr-h-[500px]" />,
  args: {
    value: '2024/11/06',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('textbox'))
  },
}

export const VRTExpandedForcedColor: StoryObj = {
  ...VRTExpanded,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

export const VRTExpandedFromTo: StoryObj = {
  ...VRTExpanded,
  args: {
    value: '2024/11/06',
    from: dayjs('2024/11/03').toDate(),
    to: dayjs('2024/11/09').toDate(),
  },
}

export const VRTExpandedFromToForcedColor: StoryObj = {
  ...VRTExpandedFromTo,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

export const VRTExpandedBottom: StoryObj = {
  ...VRTExpanded,
  render: (args) => (
    <div className="shr-w-full shr-h-[100vh] shr-relative">
      <DatePicker {...args} className="shr-absolute shr-bottom-0" />
    </div>
  ),
}
