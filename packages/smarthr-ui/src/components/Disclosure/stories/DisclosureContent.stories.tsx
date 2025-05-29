import { Button } from '../../Button'
import { DisclosureTrigger, DisclosureContent } from '../Disclosure'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Disclosure/DisclosureContent',
  component: DisclosureContent,
  render: (args) => (
    <>
      <DisclosureTrigger targetId="disclosure_1">
        <Button>ディスクロージャー</Button>
      </DisclosureTrigger>
      <DisclosureContent {...args} id="disclosure_1">
        ディスクロージャーコンテンツ
      </DisclosureContent>
    </>
  ),
  argTypes: {},
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DisclosureContent>

export const Playground: StoryObj<typeof DisclosureContent> = {
  args: {},
}

export const IsOpen: StoryObj<typeof DisclosureContent> = {
  name: 'isOpen',
  args: {
    isOpen: true,
  },
}

export const VisuallyHidden: StoryObj<typeof DisclosureContent> = {
  name: 'visuallyHidden',
  args: {
    visuallyHidden: true,
  },
}
