import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '../Button'

import {
  DialogTrigger,
  MessageDialog,
  MessageDialogContent,
  RemoteDialogTrigger,
  RemoteTriggerMessageDialog,
} from '.'

export default {
  title: 'Dialog（ダイアログ）/MessageDialog',
  component: MessageDialog,
  subcomponents: {
    DialogTrigger,
    MessageDialogContent,
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
      story: {
        inline: false,
        iframeHeight: '500px',
      },
    },
    withTheming: true,
  },
}

const dummyText = (
  <>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua.
    <br />
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
    <br />
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur.
    <br />
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
    id est laborum.
  </>
)

export const Message_Dialog: StoryFn = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onClickOpen = () => setIsOpen(true)
  const onClickClose = () => setIsOpen(false)

  return (
    <>
      <Button
        onClick={onClickOpen}
        aria-haspopup="dialog"
        aria-controls="dialog-message"
        data-test="dialog-trigger"
        // 別のスタッキングコンテキストがダイアログ背景よりも上に来ないことを確認するための記述
        style={{ position: 'relative', zIndex: 21 }}
      >
        MessageDialog
      </Button>
      <MessageDialog
        isOpen={isOpen}
        title="MessageDialog"
        subtitle="副題"
        description={<p>{dummyText} </p>}
        onClickClose={onClickClose}
        decorators={{ closeButtonLabel: (txt) => `close.(${txt})` }}
        id="dialog-message"
        data-test="dialog-content"
      />
    </>
  )
}
Message_Dialog.parameters = {
  docs: {
    description: {
      story: '`MessageDialog` can show messages.',
    },
  },
}

export const Remote_Trigger_Message_Dialog: StoryFn = () => (
  <>
    <div>
      <p>複数のトリガーに対応</p>
      <RemoteDialogTrigger targetId="remote_trigger_message_dialog_1">
        <Button>Trigger 1.</Button>
      </RemoteDialogTrigger>
      <RemoteDialogTrigger targetId="remote_trigger_message_dialog_1">
        <Button>Trigger 2.</Button>
      </RemoteDialogTrigger>
      <RemoteTriggerMessageDialog
        id="remote_trigger_message_dialog_1"
        title="Remote Trigger Message Dialog 1"
        description={<p>Remote Trigger Message Dialog.</p>}
      />
    </div>

    <div>
      <p>disabled</p>
      <RemoteDialogTrigger targetId="remote_trigger_message_dialog_2">
        <Button disabled={true}>disabled.</Button>
      </RemoteDialogTrigger>
      <RemoteTriggerMessageDialog
        id="remote_trigger_message_dialog_2"
        title="Remote Trigger Message Dialog 2"
        description={<p>Remote Trigger Message Dialog.</p>}
      />
    </div>
  </>
)

export const RegOpenedMessage: StoryFn = () => (
  <MessageDialog
    isOpen={true}
    title="MessageDialog"
    description={
      <p>
        <code>contentBgColor</code> と <code>contentPadding</code>{' '}
        でコンテンツ領域の背景色とパディングを設定できます。
      </p>
    }
    onClickClose={action('clicked close')}
    contentBgColor="BACKGROUND"
    contentPadding={1.5}
  />
)
RegOpenedMessage.parameters = { docs: { disable: true } }
