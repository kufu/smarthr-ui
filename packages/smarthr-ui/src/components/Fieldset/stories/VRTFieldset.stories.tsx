import React from 'react'

import { Stack } from '../../Layout'
import { Fieldset } from '../Fieldset'

import { _childrenOptions } from './Fieldset.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/Fieldset/VRT',
  render: (args) => (
    <Stack gap={4}>
      {[false, true].map((dangerouslyTitleHidden) =>
        [false, true].map((disabled) => (
          <Fieldset
            {...args}
            dangerouslyTitleHidden={dangerouslyTitleHidden}
            disabled={disabled}
            key={`${dangerouslyTitleHidden}${disabled}`}
          >
            <Stack>
              <Fieldset title="入れ子になったフィールドセット" titleType="subBlockTitle">
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
    title: 'フィールドセットタイトル',
    statusLabelProps: { type: 'grey', children: '任意' },
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
