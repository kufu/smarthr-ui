import { StepFormDialog } from '../StepFormDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/StepFormDialog/VRT',
  component: StepFormDialog,
  args: {
    width: '30em',
    size: 'M',
    isOpen: true,
    heading: {
      text: 'アクションダイアログタイトル',
      sub: 'アクションダイアログのサブタイトル',
    },
    submitLabel: '保存',
    contentBgColor: 'BACKGROUND',
    responseStatus: {
      status: 'success',
      text: '保存しました。',
    },
    children: 'ダイアログコンテンツ',
    stepLength: 2,
    firstStep: {
      id: 'step1',
      stepNumber: 2,
    },
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof StepFormDialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof StepFormDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
