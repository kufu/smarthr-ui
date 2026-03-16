import { Stack } from '../../Layout'
import { TextLink } from '../../TextLink'
import { LineClamp } from '../LineClamp'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const meta = {
  title: 'Components/LineClamp',
  component: LineClamp,
  render: (args) => (
    <LineClamp {...args}>
      推理小説家として No.1 とまではいかないまでも絶大な人気を誇る{' '}
      <TextLink href="http://en.wikipedia.org/wiki/Ellery_Queen">Ellery Queen</TextLink>{' '}
      は、デビュー作である{' '}
      <TextLink href="http://en.wikipedia.org/wiki/The_Roman_Hat_Mystery">
        {' '}
        The Roman Hat Mystery
      </TextLink>{' '}
      を始めとする国名シリーズと{' '}
      <TextLink href="http://en.wikipedia.org/wiki/Barnaby_Ross">Barnaby Ross</TextLink>{' '}
      としての悲劇シリーズで有名です。それらに続いて 1936 年に出版された{' '}
      <TextLink href="http://en.wikipedia.org/wiki/Halfway_House">Halfway House</TextLink> から
      Queen
      の作品に少し変化が起こり、推理小説としての側面を維持しつつも文学的な要素が強くなります。そしてその変化はライツヴィル・シリーズへと受け継がれ、このシリーズにより
      Queen の評価は不動のものとなります。
    </LineClamp>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof LineClamp>

export default meta

export const Playground: StoryObj<typeof LineClamp> = {}

export const MaxLines: StoryObj<typeof LineClamp> = {
  name: 'maxLines',
  render: (args) => (
    <Stack>
      {[undefined, 1, 2, 3, 4, 5, 6 as any].map((maxLines) => meta.render({ ...args, maxLines }))}
    </Stack>
  ),
}
