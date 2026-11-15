import { Button } from '../../Button'
import { Cluster } from '../../Layout'
import { Panel } from '../../Panel'
import { TextLink } from '../../TextLink'
import { Timeline } from '../Timeline'
import { TimelineItem } from '../TimelineItem'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Timeline/VRT',
  component: Timeline,
  render: (args) => {
    const dateSuffixArea = (
      // eslint-disable-next-line smarthr/best-practice-for-layouts -- storyでの表示例のため、growは不要
      <Cluster align="center">
        <Button variant="text" size="S">
          ボタン
        </Button>
        <TextLink href="https://smarthr.design/" size="S">
          リンク
        </TextLink>
      </Cluster>
    )
    return (
      <Timeline {...args}>
        <TimelineItem datetime="2030-01-01T00:00:00.000Z" />
        <TimelineItem datetime={new Date()} dateLabel="現在" timeFormat="none" current>
          <Panel>タイムラインアイテム</Panel>
        </TimelineItem>
        <TimelineItem datetime="2025-06-09T00:00:00.000Z" dateSuffixArea={dateSuffixArea}>
          <Panel>タイムラインアイテム</Panel>
        </TimelineItem>
        <TimelineItem datetime="2024-06-10" sideActionArea={<Button size="S">ボタン</Button>}>
          <Panel>タイムラインアイテム</Panel>
        </TimelineItem>
        <TimelineItem
          datetime="2023-06-11"
          timeFormat="HH:mm:ss"
          dateSuffixArea={dateSuffixArea}
          sideActionArea={<Button size="S">ボタン</Button>}
        >
          <Panel>タイムラインアイテム</Panel>
        </TimelineItem>
      </Timeline>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Timeline>

export const VRT: StoryObj<typeof Timeline> = {}
export const VRTForcedColors: StoryObj<typeof Timeline> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
