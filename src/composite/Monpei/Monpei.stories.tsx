import { Story } from '@storybook/react'
import React from 'react'

import { Monpei } from './Monpei'

import { SecondaryButton } from '../..'
import { Dougubako } from './Dougubako'

export default {
  title: 'Composite/Monpei',
  component: Monpei,
}

const dummy = {
  title: '従業員サーベイ',
  description:
    '一部の数値データにおいて、クロス集計する際の集計単位を変更できます例えば「年齢」を「60」以上をまとめる、「20」以下をまとめる、「10」単位でまとめるのように設定すると、以下のように出力されます。',
  actions: () => (
    <>
      <SecondaryButton>共有</SecondaryButton>
      <Dougubako>
        <SecondaryButton>削除</SecondaryButton>
      </Dougubako>
    </>
  ),
}

export const Default: Story = () => (
  <Monpei title={dummy.title} description={dummy.description}>
    <dummy.actions />
  </Monpei>
)
export const 操作なし: Story = () => <Monpei title={dummy.title} description={dummy.description} />
export const 説明なし: Story = () => (
  <Monpei title={dummy.title}>
    <dummy.actions />
  </Monpei>
)
export const 見出しのみ: Story = () => <Monpei title={dummy.title} />
