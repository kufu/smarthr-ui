import { Button } from '../../../Button'
import { ControlledActionDialog } from '../ControlledActionDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ControlledActionDialog/VRT',
  component: ControlledActionDialog,
  args: {
    width: '40em',
    size: 'M',
    isOpen: true,
    heading: {
      text: 'アクションダイアログタイトル',
      sub: 'アクションダイアログのサブタイトル',
    },
    actionButton: '保存',
    subActionArea: ({ mobileType }) => (
      <Button variant={mobileType === 'sheet' ? 'tertiary' : 'secondary'}>サブアクション</Button>
    ),
    contentBgColor: 'BACKGROUND',
    responseStatus: {
      status: 'success',
      text: '保存しました。',
    },
    children: 'ダイアログコンテンツ',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ControlledActionDialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof ControlledActionDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

export const VRTMobileSheet: StoryObj<typeof ControlledActionDialog> = {
  ...VRT,
  args: {
    mobileType: 'sheet',
  },
  parameters: {
    viewport: {
      defaultViewport: 'vrtMobile',
    },
  },
}
