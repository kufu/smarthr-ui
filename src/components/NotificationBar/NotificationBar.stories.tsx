import React, { ComponentProps, useState } from 'react'
import styled, { css } from 'styled-components'
import { Story } from '@storybook/react'

import { NotificationBar, messageTypes } from './NotificationBar'

import { LineClamp } from '../LineClamp'
import { Button } from '../Button'
import { Cluster, Stack } from '../Layout'
import { Text } from '../Text'
import { TextLink as shrTextLink } from '../TextLink'
import { CheckBox } from '../CheckBox'
import { RadioButton } from '../RadioButton'

export default {
  title: 'NotificationBar',
  component: NotificationBar,
  parameters: {
    withTheming: true,
  },
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

export const Demo: Story = () => {
  const [visible, setVisible] = useState(false)
  const [animate, setAnimate] = useState(true)
  const [messageType, setMessageType] = useState<typeof messageTypes[number]>('success')
  const [bold, setBold] = useState(true)

  return (
    <DemoWrapper>
      {visible && (
        <NotificationBar
          type={messageType}
          bold={bold}
          message="NotificationBar が表示されました"
          animate={animate}
        />
      )}
      <Center>
        <Stack>
          <label>
            <CheckBox onChange={() => setBold(!bold)} checked={bold}>
              bold
            </CheckBox>
          </label>
          <label>
            <CheckBox onChange={() => setAnimate(!animate)} checked={animate}>
              animate
            </CheckBox>
          </label>
          <Stack as="fieldset">
            <Text as="legend">メッセージの種類</Text>
            <Cluster gap={0.75}>
              {messageTypes.map((type) => (
                <label key={type}>
                  <RadioButton
                    value={type}
                    checked={messageType === type}
                    onChange={({ currentTarget: { value } }) =>
                      setMessageType(value as ComponentProps<typeof NotificationBar>['type'])
                    }
                  >
                    {type}
                  </RadioButton>
                </label>
              ))}
            </Cluster>
          </Stack>
          <Button onClick={() => setVisible(!visible)}>
            NotificationBar を{visible ? '隠す' : '表示'}
          </Button>
        </Stack>
      </Center>
    </DemoWrapper>
  )
}
Demo.parameters = {
  layout: 'fullscreen',
  withTheming: true,
}

const DemoWrapper = styled.div`
  ${({ theme: { color } }) => css`
    position: relative;
    overflow: auto;
    background-color: ${color.BACKGROUND};
  `}
`
const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
`
