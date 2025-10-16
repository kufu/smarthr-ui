import { Cluster, Stack } from '../../Layout'
import { FaAddressBookIcon } from '../../Icon'
import { Fieldset } from '../Fieldset'

import { _childrenOptions } from './Fieldset.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/Fieldset/VRT',
  render: (args) => (
    <Stack gap={4}>
      {[false, true].map((dangerouslyHideLegend) =>
        [false, true].map((disabled) => (
          <Fieldset
            {...args}
            dangerouslyHideLegend={dangerouslyHideLegend}
            disabled={disabled}
            key={`${dangerouslyHideLegend}${disabled}`}
          >
            <Stack>
              <Fieldset legend="入れ子になったフィールドセット" legendType="subBlockTitle">
                {_childrenOptions.radio}
              </Fieldset>
              {_childrenOptions.form}
            </Stack>
          </Fieldset>
        )),
      )}
    </Stack>
  ),
  args: {
    legendIcon: <FaAddressBookIcon />,
    legend: 'フィールドセットタイトル',
    statusLabelProps: { type: 'grey', children: '任意' },
    subActionArea: (
      <Cluster justify="space-between">
        <div>サブアクションエリア（start)</div>
        <div>サブアクションエリア（end)</div>
      </Cluster>
    ),
    helpMessage: 'フィールドセットの補足となるヘルプメッセージを入れます。',
    exampleMessage: '入力欄に入れる入力例',
    errorMessages: ['入力されていません', '20文字以上入力してください。'],
    supplementaryMessage: '補足メッセージがあればここに入れます。',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Fieldset>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
