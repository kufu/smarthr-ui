import { ControlledMessageDialog } from '../ControlledMessageDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ControlledMessageDialog/VRT Mobile',
  component: ControlledMessageDialog,
  args: {
    width: '40em',
    size: 'M',
    isOpen: true,
    heading: {
      text: 'メッセージダイアログタイトル',
      sub: 'メッセージダイアログのサブタイトル',
    },
    children: <p>メッセージダイアログの本文です。React ノードを渡せます。</p>,
    contentBgColor: 'BACKGROUND',
    contentPadding: 1.5,
  },
  parameters: {
    chromatic: { disableSnapshot: false },
    viewport: {
      defaultViewport: 'vrtMobile',
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ControlledMessageDialog>

export const Default = {}

export const Sheet: StoryObj<typeof ControlledMessageDialog> = {
  args: {
    mobileType: 'sheet',
  },
}
