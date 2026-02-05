import { FaAddressBookIcon } from '../../Icon'
import { Input } from '../../Input'
import { Cluster, Stack } from '../../Layout'
import { FormControl } from '../FormControl'
import { StatusLabel } from '../../StatusLabel'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/FormControl/VRT',
  render: (args) => (
    <Stack gap={4}>
      {[false, true].map((unrecommendedHide) => (
        <FormControl
          {...args}
          label={{
            ...args.label,
            unrecommendedHide,
          }}
          key={unrecommendedHide.toString()}
        />
      ))}
    </Stack>
  ),
  args: {
    children: <Input name="formcontrol_input" />,
    label: {
      text: 'フォームコントロール',
      icon: <FaAddressBookIcon />,
    },
    statusLabels: <StatusLabel type="grey">任意</StatusLabel>,
    subActionArea: (
      <Cluster justify="space-between">
        <div>サブアクションエリア（start)</div>
        <div>サブアクションエリア（end)</div>
      </Cluster>
    ),
    helpMessage: 'フォームコントロールの補足となるヘルプメッセージを入れます。',
    exampleMessage: '入力欄に入れる入力例',
    errorMessages: ['入力されていません', '20文字以上入力してください。'],
    supplementaryMessage: '補足メッセージがあればここに入れます。',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof FormControl>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
