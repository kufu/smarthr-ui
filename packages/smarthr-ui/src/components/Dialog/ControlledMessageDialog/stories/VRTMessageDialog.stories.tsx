import { ControlledMessageDialog } from '../ControlledMessageDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ControlledMessageDialog/VRT',
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
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ControlledMessageDialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof ControlledMessageDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
