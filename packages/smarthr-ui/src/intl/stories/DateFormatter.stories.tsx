import dayjs from 'dayjs'

import { DateFormatter } from '../DateFormatter'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Internal/DateFormatter',
  component: DateFormatter,
  render: (args) => <DateFormatter {...args} />,
  args: {
    date: '2025-01-01T12:00:00+09:00',
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
    date: '2025-01-01T12:00:00+09:00',
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
    date: '2025-01-01T12:00:00+09:00',
    parts: ['year', 'month', 'day', 'weekday'],
  },
}

export const YearMonthOnly: Story = {
  name: '年月のみ表示',
  args: {
    date: '2025-01-01T12:00:00+09:00',
    parts: ['year', 'month'],
  },
}

export const WeekdayOnly: Story = {
  name: '曜日のみ表示',
  args: {
    date: '2025-01-01T12:00:00+09:00',
    parts: ['weekday'],
  },
}

export const MonthDayOnly: Story = {
  name: '月日のみ表示',
  args: {
    date: '2025-01-01T12:00:00+09:00',
    parts: ['month', 'day'],
  },
}

export const DisableSlashInJa: Story = {
  name: '日本語でスラッシュ表記を無効化（月を長形式で表示）',
  args: {
    date: '2025-01-01T12:00:00+09:00',
    parts: ['year', 'month'],
    options: {
      disableSlashInJa: true,
    },
  },
}

export const CapitalizeFirstLetter: Story = {
  name: '最初の文字を大文字化（アルファベット言語のみ）',
  args: {
    date: '2025-01-01T12:00:00+09:00',
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
        <strong>2024年11月15日:</strong> <DateFormatter date="2024-11-15" />
      </div>
      <div>
        <strong>2023年6月30日:</strong> <DateFormatter date="2023-06-30" />
      </div>
      <div>
        <strong>2025年12月25日:</strong> <DateFormatter date="2025-12-25" />
      </div>
    </div>
  ),
}

const relativeNow = dayjs('2025-01-15T12:00:00+09:00').toDate()

export const Relative: Story = {
  name: '相対時間で表示（notation="relative"）',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[
        ['10秒前', '2025-01-15T11:59:50+09:00'],
        ['5分前', '2025-01-15T11:55:00+09:00'],
        ['3時間前', '2025-01-15T09:00:00+09:00'],
        ['3日前', '2025-01-12T12:00:00+09:00'],
        ['2か月前', '2024-11-15T12:00:00+09:00'],
        ['2年前', '2023-01-15T12:00:00+09:00'],
        ['3日後', '2025-01-18T12:00:00+09:00'],
      ].map(([label, date]) => (
        <div key={label}>
          <strong>{label}:</strong>{' '}
          <DateFormatter date={date} notation="relative" now={relativeNow} />
        </div>
      ))}
    </div>
  ),
}
