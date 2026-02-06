import { MessageDialog } from '../MessageDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/MessageDialog/VRT',
  component: MessageDialog,
  args: {
    width: '40em',
    size: 'M',
    isOpen: true,
    title: 'メッセージダイアログタイトル',
    subtitle: 'メッセージダイアログのサブタイトル',
    children: <p>メッセージダイアログの本文です。React ノードを渡せます。</p>,
    contentBgColor: 'BACKGROUND',
    contentPadding: 1.5,
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof MessageDialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof MessageDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
