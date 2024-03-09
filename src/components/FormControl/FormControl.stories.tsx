import { StoryFn } from '@storybook/react'
import React from 'react'

import { Input } from '../Input'
import { Stack } from '../Layout'
import { Text } from '../Text'

import { FormControl } from './FormControl'

export default {
  title: 'Forms（フォーム）/FormControl',
  component: FormControl,
}

export const All: StoryFn = () => (
  <Stack gap={2} as="dl">
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        基本
      </Text>
      <dd>
        <FormControl title="フォームコントロール名">
          <Input name="defaultInput" />
        </FormControl>
      </dd>
    </Stack>
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        すべてのオプション
      </Text>
      <dd>
        <FormControl
          title="氏名"
          statusLabelProps={{ type: 'grey', children: '任意' }}
          helpMessage="氏名を入力してください。"
          errorMessages={'氏名が入力されていません。'}
        >
          <Input name="fullname" width="100%" />
        </FormControl>
      </dd>
    </Stack>
    <Stack>
      <Text italic color="TEXT_GREY" as="dt">
        読み取り専用
      </Text>
      <dd>
        <FormControl title="氏名">
          <Input name="fullname" value="草野栄一郎" readOnly />
        </FormControl>
      </dd>
    </Stack>
  </Stack>
)
All.storyName = 'all'
