import { Stack } from '../../Layout'
import { Button } from '../../Button/'
import { DisclosureTrigger, DisclosureContent } from '../Disclosure'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Disclosure/VRT',
  render: () => (
    <>
      {[{}, { visuallyHidden: true }, { isOpen: true }].map((args, index) => (
        <>
          <DisclosureTrigger targetId={`disclosure_${index}`}>
            {({ expanded }) => <Button>ディスクロージャーを{expanded ? '閉じる' : '開く'}</Button>}
          </DisclosureTrigger>
          <DisclosureContent {...args} id={`disclosure_${index}`}>
            ディスクロージャーコンテンツ
          </DisclosureContent>
        </>
      ))}
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Disclosure>

export const VRT = {
  parameters: {},
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
