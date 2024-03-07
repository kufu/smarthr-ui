import { StoryFn } from '@storybook/react'
import React from 'react'

import { Stack } from '../../Layout'

import { BaseColumn } from './BaseColumn'

export default {
  title: 'Data Display（データ表示）/BaseColumn',
  component: BaseColumn,
}

export const All: StoryFn = () => (
  <Stack as="ul" className="shr-my-[unset] shr-list-none shr-ps-[unset]">
    <li>
      <p>padding / bgColor で余白と背景色を変えることもできます</p>
    </li>
    <li>
      <BaseColumn>初期状態。padding は1文字分。背景は COLUMN。</BaseColumn>
    </li>
    <li>
      <BaseColumn padding={1.5} bgColor="ACTION_BACKGROUND">
        padding を1.5文字分に、背景を ACTION_BACKGROUND に変更。
      </BaseColumn>
    </li>
  </Stack>
)
