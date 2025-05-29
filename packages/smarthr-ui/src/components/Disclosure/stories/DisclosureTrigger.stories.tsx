import { Button } from '../../Button'
import { Stack, Cluster } from '../../Layout'
import { DisclosureTrigger, DisclosureContent } from '../Disclosure'

import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Disclosure/DisclosureTrigger',
  component: DisclosureTrigger,
  render: (args) => (
    <>
      <DisclosureTrigger {...args} targetId="disclosure_1">
        <Button>ディスクロージャートリガー</Button>
      </DisclosureTrigger>
      <DisclosureContent id="disclosure_1">ディスクロージャーコンテンツ</DisclosureContent>
    </>
  ),
  argTypes: {},
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DisclosureTrigger>

export const Playground: StoryObj<typeof DisclosureTrigger> = {
  args: {},
}

export const OnClick: StoryObj<typeof DisclosureTrigger> = {
  name: 'onClick',
  args: {
    onClick: (toggle, e) => {
      action('on-click-trigger')(e)
      toggle()
    },
  },
}

export const Children: StoryObj<typeof DisclosureTrigger> = {
  name: 'children',
  render: () => (
    <>
      <DisclosureTrigger targetId="disclosure_1">
        {({ expanded }) => <Button>ディスクロージャーを{expanded ? '閉じる' : '開く'}</Button>}
      </DisclosureTrigger>
      <DisclosureContent id="disclosure_1">ディスクロージャーコンテンツ</DisclosureContent>
    </>
  ),
}
