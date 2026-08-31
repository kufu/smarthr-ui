import { Button } from '../../../Button'
import { ControlledActionDialog } from '../ControlledActionDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ControlledActionDialog/VRT Mobile',
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
    viewport: {
      defaultViewport: 'vrtMobile',
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ControlledActionDialog>

export const Default = {}

export const Sheet: StoryObj<typeof ControlledActionDialog> = {
  args: {
    mobileType: 'sheet',
  },
}
