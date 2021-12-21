import { Story } from '@storybook/react'
import * as React from 'react'
import readme from './README.md'
import styled from 'styled-components'

import { FlashMessage, Props, animationTypes, messageTypes } from './FlashMessage'
import { FlashMessageListProvider, useFlashMessageList } from './'

import { SecondaryButton } from '../Button'

export default {
  title: 'FlashMessage',
  component: FlashMessage,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

const Template: Story = (arg) => {
  return (
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
}
export const Bounce = Template.bind({})
Bounce.args = { animation: 'bounce' }
export const Fade = Template.bind({})
Fade.args = { animation: 'fade' }
export const None = Template.bind({})
None.args = { animation: 'none' }

export const Demo: Story = () => {
  const [visible, setVisible] = React.useState<boolean>(true)
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
          visible
          <input
            type="checkbox"
            name="visible"
            checked={visible}
            onChange={() => setVisible(!visible)}
          />
        </label>
      </p>
      <p>
        <label>
          text
          <input type="text" value={text} onChange={(e) => setText(e.currentTarget.value)} />
        </label>
      </p>
      <fieldset>
        <legend>type</legend>
        {messageTypes.map((messageType) => (
          <label key={messageType}>
            <input
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
  return <SecondaryButton onClick={handleClick}>Add message</SecondaryButton>
}
export const FlashMessageList: Story = () => {
  return (
    <FlashMessageListProvider>
      <ListInner />
    </FlashMessageListProvider>
  )
}

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
