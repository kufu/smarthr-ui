import { Button } from '../../Button'
import { DisclosureContent } from '../DisclosureContent'
import { DisclosureTrigger } from '../DisclosureTrigger'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Disclosure/VRT',
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
      {/* DisclosureContentがDisclosureTriggerより先にレンダリングされても、レンダリング順序に関わらずisOpenが反映されることを確認する */}
      {[{ isOpen: true }].map((args, index) => (
        <>
          <DisclosureContent {...args} id={`disclosure_reverse_${index}`}>
            ディスクロージャーコンテンツ
          </DisclosureContent>
          <DisclosureTrigger targetId={`disclosure_reverse_${index}`}>
            {({ expanded }) => <Button>ディスクロージャーを{expanded ? '閉じる' : '開く'}</Button>}
          </DisclosureTrigger>
        </>
      ))}
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof DisclosureContent>

export const VRT = {
  parameters: {},
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
