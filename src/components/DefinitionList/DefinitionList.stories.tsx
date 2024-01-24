import { StoryFn } from '@storybook/react'
import React from 'react'

import { Base } from '../Base'
import { Heading } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { SectioningFragment } from '../SectioningContent'
import { Text } from '../Text'

import { DefinitionList } from './DefinitionList'

export default {
  title: 'Data Display（データ表示）/DefinitionList',
  component: DefinitionList,
  parameters: {
    withTheming: true,
  },
}

const items = [
  {
    term: '社員番号',
    description: '001',
  },
  {
    term: '氏名',
    description: '草野 栄一郎',
  },
  {
    term: '部署',
    description: (
      <p>
        <code>fullWidth</code>{' '}
        は項目の幅を最大化にし、できるだけ説明を折り返さずに表示できますグループ
      </p>
    ),
    fullWidth: true,
  },
  {
    term: '雇用形態',
    description: '正社員',
  },
  {
    term: '在籍状況',
    description: '在職中',
  },
  {
    term: '入社年月日',
    description: '2023/06/05',
  },
  {
    term: '退職年月日',
    description: '-',
  },
  {
    term: (
      <Cluster align="center">
        <span>何らかの用語</span>
        <FaExclamationCircleIcon color="DANGER" text="何らかのエラーメッセージ" />
      </Cluster>
    ),
    description: 'エラーメッセージを持つ用語の説明',
  },
  {
    term: '折り返されたくない要素は nowrap',
    description: <Text whiteSpace="nowrap">so-much-longer-email-address@example.com</Text>,
  },
  {
    term: '標準は折返し',
    description: 'so-much-longer-email-address@example.com',
  },
]

export const All: StoryFn = () => (
  <Stack gap={1.5}>
    <Stack gap={0.5} as="section">
      <Heading type="blockTitle">標準</Heading>
      <p>
        基本的にカラム数を指定する必要はありません。各アイテムは最低幅 12em
        を保ちながら余った領域を埋めていきます。
      </p>
      <Base padding={1.5} overflow="auto">
        <DefinitionList items={items} />
      </Base>
    </Stack>

    <p>
      最大列数を制限することも出来ます。画面幅が狭い場合は標準と同じ動きをしますが、指定した最大列数以上には増えず幅が広がります。
    </p>

    <Stack gap={0.5} as="section">
      <Heading type="blockTitle">最大2列の場合</Heading>
      <Base padding={1.5} overflow="auto">
        <DefinitionList items={items} maxColumns={2} />
      </Base>
    </Stack>

    <Stack gap={0.5} as="section">
      <Heading type="blockTitle">最大3列の場合</Heading>
      <Base padding={1.5} overflow="auto">
        <DefinitionList items={items} maxColumns={3} />
      </Base>
    </Stack>
  </Stack>
)
All.storyName = 'all'
