import type { Meta, StoryObj } from '@storybook/react'
import { TimestampFormatter } from '../TimestampFormatter'

const testTimestamp = new Date(2025, 0, 1, 22, 40, 30) // 2025年1月1日 22:40:30

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

export const DifferentTimestamps: Story = {
  name: '異なるタイムスタンプ',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <strong>2024年11月15日 00:00:00:</strong>{' '}
        <TimestampFormatter date={new Date(2024, 10, 15, 0, 0, 0)} />
      </div>
      <div>
        <strong>2024年11月15日 09:30:00:</strong>{' '}
        <TimestampFormatter date={new Date(2024, 10, 15, 9, 30, 0)} />
      </div>
      <div>
        <strong>2024年11月15日 12:00:00:</strong>{' '}
        <TimestampFormatter date={new Date(2024, 10, 15, 12, 0, 0)} />
      </div>
      <div>
        <strong>2024年11月15日 15:45:00:</strong>{' '}
        <TimestampFormatter date={new Date(2024, 10, 15, 15, 45, 0)} />
      </div>
      <div>
        <strong>2024年11月15日 22:40:30:</strong>{' '}
        <TimestampFormatter
          date={new Date(2024, 10, 15, 22, 40, 30)}
          timeParts={['hour', 'minute', 'second']}
        />
      </div>
      <div>
        <strong>2024年11月15日 23:59:59:</strong>{' '}
        <TimestampFormatter
          date={new Date(2024, 10, 15, 23, 59, 59)}
          timeParts={['hour', 'minute', 'second']}
        />
      </div>
    </div>
  ),
}
