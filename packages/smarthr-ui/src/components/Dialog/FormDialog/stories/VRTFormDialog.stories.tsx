import { Button } from '../../../Button'
import { FormControl } from '../../../FormControl'
import { Input } from '../../../Input'
import { FormDialog } from '../FormDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/FormDialog/VRT',
  component: FormDialog,
  args: {
    width: '40em',
    size: 'M',
    isOpen: true,
    heading: {
      text: 'フォームダイアログタイトル',
      sub: 'フォームダイアログのサブタイトル',
    },
    actionText: '送信',
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
} satisfies Meta<typeof FormDialog>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof FormDialog> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
