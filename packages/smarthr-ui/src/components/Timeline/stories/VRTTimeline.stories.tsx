
import { Base } from '../../Base'
import { Button } from '../../Button'
import { Cluster } from '../../Layout'
import { TextLink } from '../../TextLink'
import { Timeline } from '../Timeline'
import { TimelineItem } from '../TimelineItem'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Timeline/VRT',
  component: Timeline,
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem datetime="2030-01-01T00:00:00.000Z" />
      <TimelineItem datetime={new Date()} dateLabel="現在" timeFormat="none" current>
        <Base>タイムラインアイテム</Base>
      </TimelineItem>
      <TimelineItem
        datetime="2025-06-09T00:00:00.000Z"
        dateSuffixArea={
          <Cluster align="center">
            <Button size="s" variant="text">
              ボタン
            </Button>
            <TextLink href="https://smarthr.design/" size="S">
              リンク
            </TextLink>
          </Cluster>
        }
      >
        <Base>タイムラインアイテム</Base>
      </TimelineItem>
      <TimelineItem datetime="2024-06-10" sideActionArea={<Button size="s">ボタン</Button>}>
        <Base>タイムラインアイテム</Base>
      </TimelineItem>
      <TimelineItem
        datetime="2023-06-11"
        timeFormat="HH:mm:ss"
        dateSuffixArea={
          <Cluster align="center">
            <Button size="s" variant="text">
              ボタン
            </Button>
            <TextLink href="https://smarthr.design/" size="S">
              リンク
            </TextLink>
          </Cluster>
        }
        sideActionArea={<Button size="s">ボタン</Button>}
      >
        <Base>タイムラインアイテム</Base>
      </TimelineItem>
    </Timeline>
  ),
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
