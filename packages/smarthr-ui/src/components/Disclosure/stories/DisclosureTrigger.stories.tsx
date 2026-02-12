import { action } from 'storybook/actions'

import { Button } from '../../Button'
import { DisclosureContent } from '../DisclosureContent'
import { DisclosureTrigger } from '../DisclosureTrigger'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Disclosure/DisclosureTrigger',
  component: DisclosureTrigger,
  render: (args) => (
    <>
      <DisclosureTrigger {...args} targetId="disclosure_1">
        <Button>ディスクロージャートリガー</Button>
      </DisclosureTrigger>
      <DisclosureContent id="disclosure_1">ディスクロージャーコンテンツ</DisclosureContent>
    </>
  ),
  argTypes: {
    children: {},
  },
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
      <DisclosureTrigger targetId="disclosure_2">
        {({ expanded }) => <Button>ディスクロージャーを{expanded ? '閉じる' : '開く'}</Button>}
      </DisclosureTrigger>
      <DisclosureContent id="disclosure_2">ディスクロージャーコンテンツ</DisclosureContent>
    </>
  ),
}
