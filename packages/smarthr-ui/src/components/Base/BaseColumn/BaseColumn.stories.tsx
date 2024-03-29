import { StoryFn } from '@storybook/react'
import React from 'react'

import { Heading } from '../../Heading'
import { Stack } from '../../Layout'
import { Section } from '../../SectioningContent'

import { BaseColumn } from './BaseColumn'

export default {
  title: 'Data Display（データ表示）/BaseColumn',
  component: BaseColumn,
}

export const All: StoryFn = () => (
  <Stack as="ul" className="shr-list-none">
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
    <li>
      <Section>
        <Heading>見出しレベルの自動計算の確認</Heading>
        <BaseColumn as="section">
          {/* FIXME: BaseColumnに対するチェックは eslint-plugin-smarthr@v0.5.9以降で修正されるため下記コメントは削除する */}
          {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
          <Heading type="blockTitle">小見出し</Heading>
        </BaseColumn>
      </Section>
    </li>
  </Stack>
)
