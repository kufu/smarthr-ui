import type { Meta, StoryObj } from '@storybook/react'

import { TimelineItem } from '../TimelineItem'
import { Stack } from '../../Layout'

export default {
  title: 'Components/Timeline/TimelineItem',
  component: TimelineItem,
  render: (args) => <TimelineItem {...args} />,
  argTypes: {
    children: {
      control: false,
    },
  },
  args: {
    datetime: new Date(),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} satisfies Meta<typeof TimelineItem>

export const Playground: StoryObj<typeof TimelineItem> = {}

export const DateLabel: StoryObj<typeof TimelineItem> = {
  name: 'dateLabel',
  args: {
    dateLabel: '日付の代わりに表示するテキスト',
  },
}

export const TimeFormat: StoryObj<typeof TimelineItem> = {
  name: 'timeFormat',
  render: (args) => (
    <Stack>
      {[undefined, 'HH:mm:ss', 'HH:mm', 'none'].map((timeFormat) => (
        <div key={timeFormat}>
          <TimelineItem {...args} timeFormat={timeFormat as 'HH:mm:ss' | 'HH:mm' | 'none'} />
        </div>
      ))}
    </Stack>
  ),
}

export const DateSuffixArea: StoryObj<typeof TimelineItem> = {
  name: 'dateSuffixArea',
  args: {
    dateSuffixArea: '日付のサフィックス領域',
  },
}

export const SideActionArea: StoryObj<typeof TimelineItem> = {
  name: 'sideActionArea',
  args: {
    sideActionArea: 'サイドアクション領域',
  },
}

export const Current: StoryObj<typeof TimelineItem> = {
  name: 'current',
  args: {
    current: true,
  },
}

export const Children: StoryObj<typeof TimelineItem> = {
  name: 'children',
  args: {
    children: 'タイムラインアイテム',
  },
}
