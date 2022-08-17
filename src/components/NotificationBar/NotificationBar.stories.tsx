import React from 'react'
import styled, { css } from 'styled-components'
import { Story } from '@storybook/react'

import { NotificationBar } from './NotificationBar'

import { LineClamp } from '../LineClamp'
import { Button } from '../Button'
import { Stack } from '../Layout'
import { Text } from '../Text'
import { TextLink as shrTextLink } from '../TextLink'

export default {
  title: 'NotificationBar',
  component: NotificationBar,
}

const TextLink = styled(shrTextLink)`
  color: inherit;

  &:hover {
    color: inherit;
  }
`

const Actions = () => (
  <>
    <Button size="s">編集</Button>
    <TextLink href="#">
      <Text size="S">ヘルプ</Text>
    </TextLink>
  </>
)

export const all: Story = () => {
  const onClose = () => console.log('close')

  return (
    <Wrapper>
      <Stack gap={0.5}>
        <dt>メッセージの種類</dt>
        <Stack gap={0.25} as="dd">
          <NotificationBar type="info" message="バックグラウンド処理中です。" onClose={onClose} />
          <NotificationBar
            type="success"
            message="タスクの削除に成功しました。"
            onClose={onClose}
          />
          <NotificationBar
            type="warning"
            message="評価開始中にタスクの削除を実行すると、情報の整合性が取れなくなる可能性があります。"
            onClose={onClose}
          />
          <NotificationBar type="error" message="タスクの削除に失敗しました。" onClose={onClose} />
        </Stack>
      </Stack>
      <Stack gap={0.5}>
        <dt>強調</dt>
        <Stack gap={0.25} as="dd">
          <NotificationBar
            type="success"
            bold
            message="タスクの削除に成功しました。"
            onClose={onClose}
          />
          <NotificationBar
            type="warning"
            bold
            message="評価開始中にタスクの削除を実行すると、情報の整合性が取れなくなる可能性があります。"
            onClose={onClose}
          />
          <NotificationBar
            type="error"
            bold
            message="タスクの削除に失敗しました。"
            onClose={onClose}
          />
        </Stack>
      </Stack>
      <Stack gap={0.5}>
        <dt>その他</dt>
        <Stack gap={0.25} as="dd">
          <NotificationBar
            type="info"
            message="ボタンやリンクを渡せます。表じゃなくなるのでborder-collapseプロパティー等に影響があるけど、子のtd要素等にはその影響は波及しないのであまり問題もなさそう。"
            onClose={onClose}
          >
            <Actions />
          </NotificationBar>
          <NotificationBar type="warning" message="onClose を省略すると、閉じるボタンが消えます" />
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
      </Stack>
    </Wrapper>
  )
}

const Wrapper = styled(Stack).attrs({ as: 'dl', gap: 1.5 })`
  ${({ theme: { color, spacingByChar } }) => css`
    margin-block: unset;
    background-color: ${color.BACKGROUND};
    padding: ${spacingByChar(1.5)};

    dd {
      margin-inline-start: unset;
    }
  `}
`
