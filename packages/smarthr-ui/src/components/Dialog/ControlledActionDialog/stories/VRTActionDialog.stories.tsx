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
    actionText: '保存',
    subActionArea: <Button>サブアクション</Button>,
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
