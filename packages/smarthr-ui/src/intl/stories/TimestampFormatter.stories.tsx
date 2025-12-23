import type { Meta, StoryObj } from '@storybook/react'
import { TimestampFormatter } from '../TimestampFormatter'

const testTimestamp = '2025-01-01T22:40:30+09:00' // 2025年1月1日 22:40:30

export default {
  title: 'Internal/TimestampFormatter',
  component: TimestampFormatter,
  render: (args) => <TimestampFormatter {...args} />,
  args: {
    date: testTimestamp,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof TimestampFormatter>

type Story = StoryObj<typeof TimestampFormatter>

export const Playground: Story = {}

export const Default: Story = {
  name: 'デフォルト（日付＋時分の表示）',
  args: {
    date: testTimestamp,
  },
}

export const WithSeconds: Story = {
  name: '秒を含めて表示',
  args: {
    date: testTimestamp,
    timeParts: ['hour', 'minute', 'second'],
  },
}

export const DateInstance: Story = {
  name: 'date（Dateインスタンスで指定）',
  args: {
    date: new Date(2025, 0, 1, 22, 40, 30), // 2025年1月1日 22:40:30
  },
}

export const DifferentTimestamps: Story = {
  name: '異なるタイムスタンプ',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <strong>2024年11月15日 00:00:00:</strong>{' '}
        <TimestampFormatter date="2024-11-15T00:00:00+09:00" />
      </div>
      <div>
        <strong>2024年11月15日 09:30:00:</strong>{' '}
        <TimestampFormatter date="2024-11-15T09:30:00+09:00" />
      </div>
      <div>
        <strong>2024年11月15日 12:00:00:</strong>{' '}
        <TimestampFormatter date="2024-11-15T12:00:00+09:00" />
      </div>
      <div>
        <strong>2024年11月15日 15:45:00:</strong>{' '}
        <TimestampFormatter date="2024-11-15T15:45:00+09:00" />
      </div>
      <div>
        <strong>2024年11月15日 22:40:30:</strong>{' '}
        <TimestampFormatter
          date="2024-11-15T22:40:30+09:00"
          timeParts={['hour', 'minute', 'second']}
        />
      </div>
      <div>
        <strong>2024年11月15日 23:59:59:</strong>{' '}
        <TimestampFormatter
          date="2024-11-15T23:59:59+09:00"
          timeParts={['hour', 'minute', 'second']}
        />
      </div>
    </div>
  ),
}
