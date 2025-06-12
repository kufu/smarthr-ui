import { Meta, StoryObj } from '@storybook/react'

import { Sidebar } from '..'
import { Gap } from '../../../../types'
import { Stack } from '../../Stack'
import { TextLink } from '../../../TextLink'

const meta = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  render: (args) => (
    <Sidebar {...args}>
      <div className="shr-border-shorthand shr-bg-white shr-p-1.5">サイドコンテンツ</div>
      <div className="shr-border-shorthand shr-bg-white shr-p-1.5">メインコンテンツ</div>
    </Sidebar>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Sidebar>
export default meta

export const Playground: StoryObj<typeof Sidebar> = {}

export const Align: StoryObj<typeof Sidebar> = {
  name: 'align',
  render: (args) => {
    return (
      <Stack>
        {[undefined, 'stretch', 'flex-start', 'center', 'flex-end'].map((align) => (
          <Sidebar {...args} align={align as any}>
            <div className="shr-border-shorthand shr-min-w-[8em] shr-bg-white shr-p-1.5">
              align: {align ?? 'undefined'}
            </div>
            <div className="shr-border-shorthand shr-bg-white shr-p-1.5">
              推理小説家として No.1 とまではいかないまでも絶大な人気を誇る{' '}
              <TextLink href="http://en.wikipedia.org/wiki/Ellery_Queen">Ellery Queen</TextLink>{' '}
              は、デビュー作である{' '}
              <TextLink href="http://en.wikipedia.org/wiki/The_Roman_Hat_Mystery">
                {' '}
                The Roman Hat Mystery
              </TextLink>{' '}
              を始めとする国名シリーズと{' '}
              <TextLink href="http://en.wikipedia.org/wiki/Barnaby_Ross">
                Barnaby Ross
              </TextLink>{' '}
              としての悲劇シリーズで有名です。それらに続いて 1936 年に出版された{' '}
              <TextLink href="http://en.wikipedia.org/wiki/Halfway_House">Halfway House</TextLink>{' '}
              から Queen
              の作品に少し変化が起こり、推理小説としての側面を維持しつつも文学的な要素が強くなります。そしてその変化はライツヴィル・シリーズへと受け継がれ、このシリーズにより
              Queen の評価は不動のものとなります。
            </div>
          </Sidebar>
        ))}
      </Stack>
    )
  },
}

export const ContentsMinWidth: StoryObj<typeof Sidebar> = {
  name: 'contentsMinWidth',
  args: {
    contentsMinWidth: '20em',
  },
}

export const Right: StoryObj<typeof Sidebar> = {
  name: 'right',
  args: {
    right: true,
  },
  render: (args) => (
    <Sidebar {...args}>
      <div className="shr-border-shorthand shr-bg-white shr-p-1.5">メインコンテンツ</div>
      <div className="shr-border-shorthand shr-bg-white shr-p-1.5">サイドコンテンツ</div>
    </Sidebar>
  ),
}

export const GapStory: StoryObj<typeof Sidebar> = {
  name: 'gap',
  render: (args, context) => (
    <Stack>
      {([undefined, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 8] as Gap[]).map(
        (gap) => meta.render && meta.render({ ...args, gap }, context),
      )}
    </Stack>
  ),
}

export const As: StoryObj<typeof Sidebar> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
