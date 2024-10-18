import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { ComponentProps, useRef, useState } from 'react'

import { Button } from '../Button'
import { Cluster, Stack } from '../Layout'

import {
  ActionDialog,
  ActionDialogContent,
  ActionDialogWithTrigger,
  DialogTrigger,
  RemoteDialogTrigger,
  RemoteTriggerActionDialog,
} from '.'

export default {
  title: 'Dialog（ダイアログ）/ActionDialog',
  component: ActionDialog,
  subcomponents: {
    DialogTrigger,
    ActionDialogContent,
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

export const Action_Dialog: StoryFn = () => {
  const [openedDialog, setOpenedDialog] = useState<'normal' | 'opened' | null>(null)
  const [responseMessage, setResponseMessage] =
    useState<ComponentProps<typeof ActionDialog>['responseMessage']>()
  const openedFocusRef = useRef<HTMLInputElement>(null)
  const onClickClose = () => {
    setOpenedDialog(null)
    setResponseMessage(undefined)
  }

  return (
    <Cluster>
      <Button
        onClick={() => setOpenedDialog('normal')}
        aria-haspopup="dialog"
        aria-controls="dialog-action"
        data-test="dialog-trigger"
        // 別のスタッキングコンテキストがダイアログ背景よりも上に来ないことを確認するための記述
        style={{ position: 'relative', zIndex: 21 }}
      >
        ActionDialog
      </Button>
      <ActionDialog
        isOpen={openedDialog === 'normal'}
        title="ActionDialog"
        subtitle="副題"
        actionText="保存"
        decorators={{ closeButtonLabel: (txt) => `cancel.(${txt})` }}
        onClickAction={(closeDialog) => {
          action('executed')()
          setResponseMessage(undefined)
          closeDialog()
        }}
        onClickClose={onClickClose}
        responseMessage={responseMessage}
        id="dialog-action"
        data-test="dialog-content"
        width="40em"
        subActionArea={<Button>サブアクション</Button>}
      >
        <Stack>
          <p>ActionDialog の本文です。</p>
          <Cluster>
            <Button
              onClick={() =>
                setResponseMessage({
                  status: 'success',
                  text: '保存しました。',
                })
              }
            >
              保存
            </Button>
            <Button
              onClick={() =>
                setResponseMessage({
                  status: 'error',
                  text: '何らかのエラーが発生しました。',
                })
              }
            >
              エラー
            </Button>
            <Button
              onClick={() =>
                setResponseMessage({
                  status: 'processing',
                })
              }
            >
              保存中
            </Button>
          </Cluster>
        </Stack>
      </ActionDialog>
      <Button onClick={() => setOpenedDialog('opened')} data-test="opened-dialog-trigger">
        開いた状態で DOM に投入
      </Button>
      {openedDialog === 'opened' && (
        <ActionDialog
          isOpen
          title="開いた状態で投入されたダイアログ"
          actionText="実行"
          onClickAction={(closeDialog) => {
            action('execute')()
            closeDialog()
          }}
          onClickClose={onClickClose}
          decorators={{ closeButtonLabel: (txt) => `close.(${txt})` }}
          firstFocusTarget={openedFocusRef}
          data-test="opened-dialog"
        >
          <Stack align="flex-start">
            <code>isOpen=true</code> の状態で DOM に投入した場合のダイアログ
          </Stack>
        </ActionDialog>
      )}
    </Cluster>
  )
}

Action_Dialog.parameters = {
  docs: {
    description: {
      story: '`ActionDialog` includes an action button that used for confirm, etc.',
    },
  },
}

export const Action_Dialog_With_Trigger: StoryFn = () => (
  <>
    <ActionDialogWithTrigger
      trigger={<Button>open.</Button>}
      title="ActionDialog With Trigger"
      actionText="保存"
      onClickAction={(close) => {
        close()
      }}
    >
      <p>ActionDialog with Trigger.</p>
    </ActionDialogWithTrigger>

    <ActionDialogWithTrigger
      trigger={<Button disabled={true}>open.</Button>}
      title="Disabled ActionDialog With Trigger"
      actionText="保存"
      onClickAction={(close) => {
        close()
      }}
    >
      <p>ActionDialog with Trigger.</p>
    </ActionDialogWithTrigger>
  </>
)

export const Remote_Trigger_Action_Dialog: StoryFn = () => (
  <>
    <div>
      <p>複数のトリガーに対応</p>
      <RemoteDialogTrigger targetId="remote_trigger_action_dialog_1">
        <Button>Trigger 1.</Button>
      </RemoteDialogTrigger>
      <RemoteDialogTrigger targetId="remote_trigger_action_dialog_1">
        <Button>Trigger 2.</Button>
      </RemoteDialogTrigger>
      <RemoteTriggerActionDialog
        id="remote_trigger_action_dialog_1"
        title="Remote Trigger Action Dialog 1"
        actionText="保存"
        onClickAction={(close) => {
          close()
        }}
        onToggle={(isOpen) => {
          console.log(`isOpen: ${isOpen}`)
        }}
        onOpen={() => console.log(`open!`)}
        onClose={() => console.log(`close!`)}
      >
        <p>Remote Trigger Action Dialog.</p>
      </RemoteTriggerActionDialog>
    </div>

    <div>
      <p>disabled</p>
      <RemoteDialogTrigger targetId="remote_trigger_action_dialog_2">
        <Button disabled={true}>disabled.</Button>
      </RemoteDialogTrigger>
      <RemoteTriggerActionDialog
        id="remote_trigger_action_dialog_2"
        title="Remote Trigger Action Dialog 2"
        actionText="保存"
        onClickAction={(close) => {
          close()
        }}
      >
        <p>Remote Trigger Action Dialog.</p>
      </RemoteTriggerActionDialog>
    </div>
  </>
)

export const RegOpenedAction: StoryFn = () => (
  <ActionDialog
    isOpen={true}
    title="ActionDialog"
    actionText="保存"
    onClickAction={action('clicked action')}
    onClickClose={action('clicked close')}
    contentBgColor="BACKGROUND"
    contentPadding={1.5}
  >
    <p>
      <code>contentBgColor</code> と <code>contentPadding</code>{' '}
      でコンテンツ領域の背景色とパディングを設定できます。
    </p>
    <label>
      <input name="reg_opened_action_checkbox" type="checkbox" />
      Agree
    </label>
  </ActionDialog>
)
RegOpenedAction.parameters = { docs: { disable: true } }
