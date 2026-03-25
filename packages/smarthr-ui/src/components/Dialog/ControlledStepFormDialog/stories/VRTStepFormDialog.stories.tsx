import { ControlledStepFormDialog } from '../ControlledStepFormDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ControlledStepFormDialog/VRT',
  component: ControlledStepFormDialog,
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
} satisfies Meta<typeof ControlledStepFormDialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof ControlledStepFormDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
