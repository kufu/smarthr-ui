import { Input } from '../../Input'
import { Cluster, Stack } from '../../Layout'
import { FormControl } from '../FormControl'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/FormControl/VRT',
  render: (args) => (
    <Stack gap={4}>
      {[false, true].map((dangerouslyTitleHidden) => (
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl
          {...args}
          key={dangerouslyTitleHidden.toString()}
          dangerouslyTitleHidden={dangerouslyTitleHidden}
        />
      ))}
    </Stack>
  ),
  args: {
    // eslint-disable-next-line smarthr/a11y-input-has-name-attribute, smarthr/a11y-input-in-form-control
    children: <Input />,
    title: 'フォームコントロール',
    statusLabelProps: { type: 'grey', children: '任意' },
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
