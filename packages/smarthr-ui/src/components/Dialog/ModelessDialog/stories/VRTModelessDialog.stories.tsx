import { ModelessDialog } from '../ModelessDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ModelessDialog/VRT',
  component: ModelessDialog,
  args: {
    isOpen: true,
    heading: 'モードレスダイアログタイトル',
    children: 'ダイアログコンテンツ',
    footer: 'ダイアログフッター',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    width: '20em',
    height: '10em',
    size: 'M',
    resizable: true,
    contentBgColor: 'BACKGROUND',
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ModelessDialog>

export const VRT: StoryObj<typeof ModelessDialog> = {}

export const VRTForcedColors: StoryObj<typeof ModelessDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
