import { Button } from '../../../Button'
import { FormControl } from '../../../FormControl'
import { Input } from '../../../Input'
import { ControlledFormDialog } from '../ControlledFormDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ControlledFormDialog/VRT',
  component: ControlledFormDialog,
  args: {
    width: '40em',
    size: 'M',
    isOpen: true,
    heading: {
      text: 'フォームダイアログタイトル',
      sub: 'フォームダイアログのサブタイトル',
    },
    actionButton: '送信',
    subActionArea: <Button>サブアクション</Button>,
    contentBgColor: 'BACKGROUND',
    responseStatus: {
      status: 'success',
      text: '送信しました。',
    },
    children: (
      <FormControl label="名前">
        <Input name="name" />
      </FormControl>
    ),
    onSubmit: () => {},
    onClickClose: () => {},
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ControlledFormDialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof ControlledFormDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
