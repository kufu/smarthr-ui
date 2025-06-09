import type { Meta, StoryObj } from '@storybook/react'

import { Timeline } from '../Timeline'
import { TimelineItem } from '../TimelineItem'

export default {
  title: 'Components/Timeline',
  component: Timeline,
  subcomponents: { TimelineItem },
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem datetime={new Date()}>タイムラインアイテム</TimelineItem>
      <TimelineItem datetime={new Date()}>タイムラインアイテム</TimelineItem>
    </Timeline>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Timeline>

export const Playground: StoryObj<typeof Timeline> = {}
