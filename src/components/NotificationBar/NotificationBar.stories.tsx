import React from 'react'
import styled from 'styled-components'
import { Story } from '@storybook/react'

import { NotificationBar } from './NotificationBar'
import readme from './README.md'

import { LineClamp } from '../LineClamp'
import { SecondaryButton } from '../Button'
import { Stack } from '../Layout'
import { Text } from '../Text'
import { TextLink as shrTextLink } from '../TextLink'

export default {
  title: 'NotificationBar',
  component: NotificationBar,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

const TextLink = styled(shrTextLink)`
  color: inherit;

  &:hover,
  &:focus {
    color: inherit;
  }
`

const Actions = () => (
  <>
    <SecondaryButton size="s">編集</SecondaryButton>
    <TextLink href="#">
      <Text size="S">ヘルプ</Text>
    </TextLink>
  </>
)

export const all: Story = () => {
  const onClose = () => console.log('close')

  return (
    <Stack gap={0}>
      <NotificationBar type="info" message="バックグラウンド処理中です。" onClose={onClose} />
      <NotificationBar type="success" message="タスクの削除に成功しました。" onClose={onClose} />
      <NotificationBar type="error" message="タスクの削除に失敗しました。" onClose={onClose} />
      <NotificationBar
        type="warning"
        message="評価開始中にタスクの削除を実行すると、情報の整合性が取れなくなる可能性があります。"
        onClose={onClose}
      />
      <NotificationBar
        type="info"
        message="表じゃなくなるのでborder-collapseプロパティー等に影響があるけど、子のtd要素等にはその影響は波及しないのであまり問題もなさそう。"
        onClose={onClose}
      >
        <Actions />
      </NotificationBar>
      <NotificationBar
        type="success"
        message="Float Label Patternはかっこよくて、単にラベルをプレースホルダーにするよりはマシなので使いたくなる。"
        onClose={onClose}
      >
        <Actions />
      </NotificationBar>
      <NotificationBar
        type="error"
        message="実装の基本的な部分での至らなさなので、こっちの修正が完了するまでは上記のようなCSSで一部ごまかすしかなさそう。"
        onClose={onClose}
      >
        <Actions />
      </NotificationBar>
      <NotificationBar
        type="warning"
        message="履歴の共有は、検索結果の最適化やアプリの推薦などまで考えると、真価を発揮すると思う。"
        onClose={onClose}
      >
        <Actions />
      </NotificationBar>
      <NotificationBar type="info" message="onClose を省略すると、閉じるボタンが消えます" />
      <NotificationBar
        type="success"
        message={
          <LineClamp maxLines={1} withTooltip>
            非推奨ですが、LineClamp
            を使用して省略もできます。そのでっかい領域によるヘッダー（のナビゲーション）へのアクセス性の低下をフォローするために多くのウェブサイトはヘッダーを固定しちゃうわけなんだけど、それでは同時にコンテンツの閲覧性に影響を与えてしまう。
          </LineClamp>
        }
        onClose={onClose}
      />
    </Stack>
  )
}
