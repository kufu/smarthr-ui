import type { Meta, StoryObj } from '@storybook/react'
import { DateFormatter } from '../DateFormatter'

const testDate = '2025-01-01T12:00:00+09:00' // 2025年1月1日

export default {
  title: 'Internal/DateFormatter',
  component: DateFormatter,
  render: (args) => <DateFormatter {...args} />,
  args: {
    date: testDate,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof DateFormatter>

type Story = StoryObj<typeof DateFormatter>

export const Playground: Story = {}

export const Default: Story = {
  name: 'デフォルト（曜日なしの表示）',
  args: {
    date: testDate,
  },
}

export const DateInstance: Story = {
  name: 'date（Dateインスタンスで指定）',
  args: {
    date: new Date(2025, 0, 1), // 2025年1月1日
  },
}

export const YearMonthDayWeekday: Story = {
  name: '年月日＋曜日の表示',
  args: {
    date: testDate,
    parts: ['year', 'month', 'day', 'weekday'],
  },
}

export const YearMonthOnly: Story = {
  name: '年月のみ表示',
  args: {
    date: testDate,
    parts: ['year', 'month'],
  },
}

export const WeekdayOnly: Story = {
  name: '曜日のみ表示',
  args: {
    date: testDate,
    parts: ['weekday'],
  },
}

export const MonthDayOnly: Story = {
  name: '月日のみ表示',
  args: {
    date: testDate,
    parts: ['month', 'day'],
  },
}

export const DisableSlashInJa: Story = {
  name: '日本語でスラッシュ表記を無効化（月を長形式で表示）',
  args: {
    date: testDate,
    parts: ['year', 'month'],
    options: {
      disableSlashInJa: true,
    },
  },
}

export const CapitalizeFirstLetter: Story = {
  name: '最初の文字を大文字化（アルファベット言語のみ）',
  args: {
    date: testDate,
    parts: ['weekday'],
    options: {
      capitalizeFirstLetter: true,
    },
  },
}

export const DifferentDates: Story = {
  name: '異なる日付',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <strong>2024年11月15日:</strong> <DateFormatter date={new Date(2024, 10, 15)} />
      </div>
      <div>
        <strong>2023年6月30日:</strong> <DateFormatter date={new Date(2023, 5, 30)} />
      </div>
      <div>
        <strong>2025年12月25日:</strong> <DateFormatter date={new Date(2025, 11, 25)} />
      </div>
    </div>
  ),
}
