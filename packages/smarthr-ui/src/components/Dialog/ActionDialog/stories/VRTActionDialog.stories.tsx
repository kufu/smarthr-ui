import { Button } from '../../../Button'
import { ActionDialog } from '../ActionDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ActionDialog/VRT',
  component: ActionDialog,
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
} satisfies Meta<typeof ActionDialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof ActionDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
