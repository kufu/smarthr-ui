import type { Meta, StoryObj } from '@storybook/react'
import { TimeFormatter } from '../TimeFormatter'

const testTime = '2025-01-01T22:40:30+09:00' // 2025年1月1日 22:40:30

export default {
  title: 'Internal/TimeFormatter',
  component: TimeFormatter,
  render: (args) => <TimeFormatter {...args} />,
  args: {
    date: testTime,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof TimeFormatter>

type Story = StoryObj<typeof TimeFormatter>

export const Playground: Story = {}

export const Default: Story = {
  name: 'デフォルト（時分の表示）',
  args: {
    date: testTime,
  },
}

export const HourMinuteSecond: Story = {
  name: '時分秒の表示',
  args: {
    date: testTime,
    parts: ['hour', 'minute', 'second'],
  },
}

export const HourOnly: Story = {
  name: '時のみ表示',
  args: {
    date: testTime,
    parts: ['hour'],
  },
}

export const Hour12: Story = {
  name: '12時間形式で表示',
  args: {
    date: testTime,
    options: {
      hour12: true,
    },
  },
}

export const Hour24: Story = {
  name: '24時間形式で表示',
  args: {
    date: testTime,
    options: {
      hour12: false,
    },
  },
}

export const DateInstance: Story = {
  name: 'date（Dateインスタンスで指定）',
  args: {
    date: new Date(2025, 0, 1, 22, 40, 30), // 2025年1月1日 22:40:30
  },
}

export const DifferentTimes: Story = {
  name: '異なる時刻',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <strong>00:00:00:</strong> <TimeFormatter date="2025-01-01T00:00:00+09:00" />
      </div>
      <div>
        <strong>09:30:00:</strong> <TimeFormatter date="2025-01-01T09:30:00+09:00" />
      </div>
      <div>
        <strong>12:00:00:</strong> <TimeFormatter date="2025-01-01T12:00:00+09:00" />
      </div>
      <div>
        <strong>15:45:00:</strong> <TimeFormatter date="2025-01-01T15:45:00+09:00" />
      </div>
      <div>
        <strong>22:40:30:</strong> <TimeFormatter date="2025-01-01T22:40:30+09:00" />
      </div>
      <div>
        <strong>23:59:59:</strong> <TimeFormatter date="2025-01-01T23:59:59+09:00" />
      </div>
    </div>
  ),
}
