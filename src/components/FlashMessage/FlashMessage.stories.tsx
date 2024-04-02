import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Button } from '../Button'

import { FlashMessage, Props, animationTypes, messageTypes } from './FlashMessage'

import { FlashMessageListProvider, useFlashMessageList } from '.'

export default {
  title: 'States（状態）/FlashMessage（非推奨）',
  component: FlashMessage,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: '500px',
      },
    },
  },
}

const Template: StoryFn = (arg) => (
  <List>
    {messageTypes.map((messageType) => (
      <li key={messageType}>
        <FlashMessage
          type={messageType}
          visible={true}
          text={
            messageType === 'success'
              ? '成功しました'
              : messageType === 'info'
                ? '開始しました'
                : messageType === 'warning'
                  ? '保存されていない可能性があります'
                  : messageType === 'error'
                    ? '9 件のエラーがあります'
                    : ''
          }
          animation={arg.animation}
          onClose={() => {
            console.log('close')
          }}
        />
      </li>
    ))}
    <li>
      <FlashMessage
        type="success"
        visible={true}
        animation={arg.animation}
        text="長いテキスト:編集内容を自動保存したので何卒ご確認のほどよろしくお願いいたします。編集内容を自動保存したので何卒ご確認のほどよろしくお願いいたします。編集内容を自動保存したので何卒ご確認のほどよろしくお願いいたします。"
        onClose={() => {
          console.log('close')
        }}
      />
    </li>
  </List>
)
export const Bounce = Template.bind({})
Bounce.args = { animation: 'bounce' }
export const Fade = Template.bind({})
Fade.args = { animation: 'fade' }
export const None = Template.bind({})
None.args = { animation: 'none' }

export const Demo: StoryFn = () => {
  const [visible, setVisible] = React.useState<boolean>(true)
  const [autoClose, setAutoClose] = React.useState<boolean>(true)
  const [type, setType] = React.useState<Props['type']>('success')
  const [animation, setAnimation] = React.useState<Props['animation']>('bounce')
  const [text, setText] = React.useState<string>('自動保存しました')

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.currentTarget.value as Props['type'])
  }

  const handleAnimationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnimation(event.currentTarget.value as Props['animation'])
  }

  return (
    <div style={{ padding: '20px' }}>
      <p>
        <label>
          <input
            type="checkbox"
            name="visible"
            checked={visible}
            onChange={() => setVisible(!visible)}
          />
          visible
        </label>
      </p>
      <p>
        <label>
          text
          {/* eslint-disable-next-line  smarthr/a11y-input-in-form-control */}
          <input
            name="text"
            type="text"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
        </label>
      </p>
      <p>
        <label>
          <input
            type="checkbox"
            name="autoClose"
            checked={autoClose}
            onChange={(e) => setAutoClose(e.target.checked)}
          />
          auto close
        </label>
      </p>
      <fieldset>
        <legend>type</legend>
        {messageTypes.map((messageType) => (
          <label key={messageType}>
            <input
              name="messageType"
              type="radio"
              onChange={handleTypeChange}
              value={messageType}
              checked={type === messageType}
            />
            {messageType}
          </label>
        ))}
      </fieldset>
      <hr />
      <fieldset>
        <legend>animation</legend>
        {animationTypes.map((animationType) => (
          <label key={animationType}>
            <input
              name="animationType"
              type="radio"
              onChange={handleAnimationChange}
              value={animationType}
              checked={animation === animationType}
            />
            {animationType}
          </label>
        ))}
      </fieldset>

      <FlashMessage
        visible={visible}
        autoClose={autoClose}
        type={type}
        text={text}
        animation={animation}
        onClose={() => {
          setVisible(false)
        }}
      />
    </div>
  )
}

let messageCount = 1
const ListInner = () => {
  const { enqueueMessage } = useFlashMessageList()

  const handleClick = () => {
    enqueueMessage({
      type: 'success',
      text: `success ${messageCount++}`,
    })
  }
  return <Button onClick={handleClick}>Add message</Button>
}
export const FlashMessageList: StoryFn = () => (
  <FlashMessageListProvider>
    <ListInner />
  </FlashMessageListProvider>
)

const List = styled.ul`
  margin: 40px;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;

  & > li {
    min-height: 60px;
    position: relative;
  }

  /* overwrite FlashMessage style */
  & > li > div {
    position: static;
    display: inline-flex;
  }
`
