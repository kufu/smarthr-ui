import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { ComponentProps, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button } from '../Button'
import { DatePicker } from '../DatePicker'
import { Fieldset } from '../Fieldset'
import { FormControl } from '../FormControl'
import { Heading } from '../Heading'
import { Input } from '../Input'
import { Cluster, Stack } from '../Layout'
import { RadioButton } from '../RadioButton'
import { Section } from '../SectioningContent'

import {
  ActionDialog,
  ActionDialogContent,
  Dialog,
  DialogCloser,
  DialogContent,
  DialogTrigger,
  DialogWrapper,
  FormDialog,
  MessageDialog,
  MessageDialogContent,
  ModelessDialog,
  RemoteDialogTrigger,
  RemoteTriggerFormDialog,
} from '.'

export default {
  title: 'Dialog（ダイアログ）/Dialog',
  component: Dialog,
  subcomponents: {
    DialogContent,
    DialogWrapper,
    DialogTrigger,
    DialogCloser,
    MessageDialog,
    MessageDialogContent,
    ActionDialog,
    ActionDialogContent,
    ModelessDialog,
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

export const Default: StoryFn = () => {
  const [opened, setOpened] = useState<'default' | 'focus' | null>(null)
  const [value, setValue] = useState('Apple')
  const [date, setDate] = useState<Date | null>(null)
  const onClickClose = () => setOpened(null)
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <TriggerList>
      <li>
        <Button
          onClick={() => setOpened('default')}
          aria-haspopup="dialog"
          aria-controls="dialog-default"
          data-test="dialog-trigger"
          // 別のスタッキングコンテキストがダイアログ背景よりも上に来ないことを確認するための記述
          style={{ zIndex: 21, position: 'relative' }}
        >
          Dialog
        </Button>
        <Dialog
          isOpen={opened === 'default'}
          onPressEscape={onClickClose}
          id="dialog-default"
          ariaLabel="Dialog"
          data-test="dialog-content"
        >
          <Fieldset title="Dialog" titleType="sectionTitle">
            <p>The value of isOpen must be managed by you, but you can customize content freely.</p>
            <DatePicker
              name="dialog_datepicker"
              value={date?.toDateString()}
              formatDate={(_date) => (_date ? _date.toDateString() : '')}
              onChangeDate={(_date) => setDate(_date)}
              title="test"
              data-test="dialog-datepicker"
            />
            <Fieldset title="Fruits" innerMargin={0.5}>
              <RadioListCluster forwardedAs="ul">
                <li>
                  <RadioButton name="Apple" checked={value === 'Apple'} onChange={onChangeValue}>
                    Apple
                  </RadioButton>
                </li>
                <li>
                  <RadioButton name="Orange" checked={value === 'Orange'} onChange={onChangeValue}>
                    Orange
                  </RadioButton>
                </li>
                <li>
                  <RadioButton name="Grape" checked={value === 'Grape'} onChange={onChangeValue}>
                    Grape
                  </RadioButton>
                </li>
              </RadioListCluster>
            </Fieldset>
          </Fieldset>
          {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
          <FooterCluster>
            <Button onClick={onClickClose} data-test="dialog-closer">
              close
            </Button>
          </FooterCluster>
        </Dialog>
      </li>
      <li>
        <Button
          onClick={() => setOpened('focus')}
          aria-haspopup="dialog"
          aria-controls="dialog-focus"
          data-test="dialog-focus-trigger"
        >
          特定の要素をフォーカス
        </Button>
        <Dialog
          isOpen={opened === 'focus'}
          onPressEscape={onClickClose}
          firstFocusTarget={inputRef}
          id="dialog-focus"
          ariaLabel="特定の要素をフォーカスするダイアログ"
        >
          <FormControl title="特定の要素をフォーカスするダイアログ">
            <Input ref={inputRef} name="input_focus_target" data-test="input-focus-target" />
          </FormControl>
          {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
          <FooterCluster>
            <Button onClick={onClickClose} data-test="dialog-closer">
              close
            </Button>
          </FooterCluster>
        </Dialog>
      </li>
    </TriggerList>
  )
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

export const Form_Dialog: StoryFn = () => {
  const [openedDialog, setOpenedDialog] = useState<'normal' | 'opened' | null>(null)
  const [value, setValue] = React.useState('Apple')
  const [responseMessage, setResponseMessage] =
    useState<ComponentProps<typeof ActionDialog>['responseMessage']>()
  const openedFocusRef = useRef<HTMLInputElement>(null)
  const onClickClose = () => {
    setOpenedDialog(null)
    setResponseMessage(undefined)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)

  return (
    <Cluster>
      <Button
        onClick={() => setOpenedDialog('normal')}
        aria-haspopup="dialog"
        aria-controls="dialog-form"
        data-test="dialog-trigger"
        // 別のスタッキングコンテキストがダイアログ背景よりも上に来ないことを確認するための記述
        style={{ position: 'relative', zIndex: 21 }}
      >
        FormDialog
      </Button>
      <FormDialog
        isOpen={openedDialog === 'normal'}
        title="FormDialog"
        subtitle="副題"
        actionText="保存"
        decorators={{ closeButtonLabel: (txt) => `cancel.(${txt})` }}
        onSubmit={(closeDialog, e) => {
          action('executed')()
          console.log('event', e)
          setResponseMessage(undefined)
          closeDialog()
        }}
        onClickClose={onClickClose}
        responseMessage={responseMessage}
        id="dialog-form"
        data-test="form-dialog-content"
        width="40em"
        subActionArea={<Button>サブアクション</Button>}
      >
        <Stack>
          <Fieldset title="fruits" innerMargin={0.5}>
            <RadioListCluster forwardedAs="ul">
              <li>
                <RadioButton name="Apple" checked={value === 'Apple'} onChange={onChange}>
                  Apple
                </RadioButton>
              </li>
              <li>
                <RadioButton name="Orange" checked={value === 'Orange'} onChange={onChange}>
                  Orange
                </RadioButton>
              </li>
              <li>
                <RadioButton name="Grape" checked={value === 'Grape'} onChange={onChange}>
                  Grape
                </RadioButton>
              </li>
            </RadioListCluster>
          </Fieldset>
          <Cluster align="center">
            <p>切り替えボタン：</p>
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
      </FormDialog>
      <Button onClick={() => setOpenedDialog('opened')} data-test="opened-form-dialog-trigger">
        開いた状態で DOM に投入
      </Button>
      {openedDialog === 'opened' && (
        <FormDialog
          isOpen
          title="開いた状態で投入されたダイアログ"
          actionText="実行"
          onSubmit={(closeDialog) => {
            action('execute')()
            closeDialog()
          }}
          onClickClose={onClickClose}
          decorators={{ closeButtonLabel: (txt) => `close.(${txt})` }}
          firstFocusTarget={openedFocusRef}
          data-test="opened-form-dialog"
        >
          <FormControl
            title={
              <>
                <code>isOpen=true</code> の状態で DOM に投入した場合のダイアログ
              </>
            }
          >
            <Input
              ref={openedFocusRef}
              name="opened_dialog_focus_target"
              data-test="opened-form-dialog-focus-target"
            />
          </FormControl>
        </FormDialog>
      )}
    </Cluster>
  )
}

Form_Dialog.parameters = {
  docs: {
    description: {
      story: '`ActionDialog` includes an action button that used for submitting, etc.',
    },
  },
}

export const Remote_Trigger_Form_Dialog: StoryFn = () => (
  <>
    <div>
      <p>複数のトリガーに対応</p>
      <RemoteDialogTrigger targetId="remote_trigger_form_dialog_1">
        <Button>Trigger 1.</Button>
      </RemoteDialogTrigger>
      <RemoteDialogTrigger targetId="remote_trigger_form_dialog_1">
        <Button>Trigger 2.</Button>
      </RemoteDialogTrigger>
      <RemoteTriggerFormDialog
        id="remote_trigger_form_dialog_1"
        title="Remote Trigger Form Dialog 1"
        actionText="保存"
        onSubmit={(close) => {
          close()
        }}
      >
        <p>Remote Trigger Form Dialog.</p>
      </RemoteTriggerFormDialog>
    </div>

    <div>
      <p>disabled</p>
      <RemoteDialogTrigger targetId="remote_trigger_form_dialog_2">
        <Button disabled={true}>disabled.</Button>
      </RemoteDialogTrigger>
      <RemoteTriggerFormDialog
        id="remote_trigger_form_dialog_2"
        title="Remote Trigger Form Dialog 2"
        actionText="保存"
        onSubmit={(close) => {
          close()
        }}
      >
        <p>Remote Trigger Form Dialog.</p>
      </RemoteTriggerFormDialog>
    </div>
  </>
)

export const Uncontrolled: StoryFn = () => (
  <TriggerList>
    <li>
      <DialogWrapper>
        <DialogTrigger>
          <Button
            aria-haspopup="dialog"
            aria-controls="dialog-uncontrolled"
            data-test="dialog-trigger"
          >
            Dialog
          </Button>
        </DialogTrigger>
        <DialogContent id="dialog-uncontrolled" data-test="dialog-content">
          <p>Uncontrolled Dialog.</p>
          <DialogCloser>
            <Button data-test="dialog-closer">Close</Button>
          </DialogCloser>
        </DialogContent>
      </DialogWrapper>
    </li>
    <li>
      <DialogWrapper>
        <DialogTrigger>
          <Button
            aria-haspopup="dialog"
            aria-controls="dialog-uncontrolled-message"
            data-test="message-dialog-trigger"
          >
            MessageDialog
          </Button>
        </DialogTrigger>
        <MessageDialogContent
          title="Uncontrolled Message Dialog"
          description={<p>{dummyText} </p>}
          id="dialog-uncontrolled-message"
          data-test="message-dialog-content"
        />
      </DialogWrapper>
    </li>
    <li>
      <DialogWrapper>
        <DialogTrigger>
          <Button
            aria-haspopup="dialog"
            aria-controls="dialog-uncontrolled-action"
            data-test="action-dialog-trigger"
          >
            ActionDialog
          </Button>
        </DialogTrigger>
        <ActionDialogContent
          title="Uncontrolled Action Dialog"
          actionText="実行"
          actionDisabled={false}
          onClickAction={(closeDialog) => {
            action('executed')()
            closeDialog()
          }}
          id="dialog-uncontrolled-action"
          data-test="action-dialog-content"
        >
          <p>
            The content of ActionDialogContent is freely implemented by the user as children.
            <br />
            So you need to prepare your own style.
            <br />
            When action is executed, you can specify when to close dialog. In this story, dialog
            closes one second after clicking action
          </p>
        </ActionDialogContent>
      </DialogWrapper>
    </li>
  </TriggerList>
)
Uncontrolled.parameters = {
  docs: {
    description: {
      story:
        'Uncontrolled dialogs do not need to control its state of open / close, and they handle by themselves.',
    },
  },
}

export const WidthAndPosition: StoryFn = () => (
  <TriggerList>
    <li>
      <DialogWrapper>
        <DialogTrigger>
          <Button aria-haspopup="dialog" aria-controls="dialog-width-1">
            幅 400px
          </Button>
        </DialogTrigger>
        <DialogContent width={400} id="dialog-width-1">
          <p>幅 400px のダイアログ</p>
        </DialogContent>
      </DialogWrapper>
    </li>
    <li>
      <DialogWrapper>
        <DialogTrigger>
          <Button aria-haspopup="dialog" aria-controls="dialog-width-2">
            幅 80%
          </Button>
        </DialogTrigger>
        <DialogContent width="80%" id="dialog-width-2">
          <p>幅 80% のダイアログ</p>
        </DialogContent>
      </DialogWrapper>
    </li>
  </TriggerList>
)
WidthAndPosition.parameters = {
  docs: {
    description: {
      story: 'The position of Dialog can be changed.',
    },
  },
}

export const WithScroll: StoryFn = () => (
  <ScrollWrapper>
    <BorderedWrapper>
      We can confirm that there is no change in the width of the wrapper for this text before and
      after opening a dialog.
    </BorderedWrapper>
    <DialogWrapper>
      <DialogTrigger>
        <Button aria-haspopup="dialog" aria-controls="dialog-with-scroll-1">
          Open Dialog
        </Button>
      </DialogTrigger>
      <DialogContent id="dialog-with-scroll-1">
        <ContentWrapper>
          <div>
            The content behind the opened dialog is not scrollable.
            <br />
            Of course the content on the opened dialog is scrollable.
          </div>
          <br />
        </ContentWrapper>
      </DialogContent>
    </DialogWrapper>
  </ScrollWrapper>
)
WithScroll.parameters = { docs: { disable: true } }
const ScrollWrapper = styled.div`
  height: 200vh;
  margin: 1rem;
  padding: 1rem;
`
const BorderedWrapper = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  border: solid 1px gray;
`
const ContentWrapper = styled.div`
  width: 50vh;
  height: 50vh;
  overflow: auto;
  padding: 1rem;
  & > div {
    margin-bottom: 100vh;
  }
`

export const RegDialogOpenedDialog: StoryFn = () => (
  <Dialog isOpen>
    <p>{dummyText}</p>
  </Dialog>
)

export const RegDialogOpenedDialogWidth: StoryFn = () => (
  <Dialog isOpen width={500}>
    <p>{dummyText}</p>
  </Dialog>
)

export const RegOpenedForm: StoryFn = () => (
  <FormDialog
    isOpen={true}
    title="FormDialog"
    actionText="保存"
    onSubmit={action('clicked submit')}
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
  </FormDialog>
)
RegOpenedForm.parameters = { docs: { disable: true } }

export const Body以外のPortalParent: StoryFn = () => {
  const [isOpen, setIsOpen] = useState<'default' | 'action' | 'message' | 'modeless'>()
  const onClickOpen = (type: 'default' | 'action' | 'message' | 'modeless') => setIsOpen(type)
  const onClickClose = () => setIsOpen(undefined)
  const portalParentRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={portalParentRef}>
      <Stack align="flex-start">
        <Button
          onClick={() => onClickOpen('default')}
          aria-haspopup="dialog"
          aria-controls="portal-default"
          data-test="dialog-trigger"
        >
          Dialog を開く
        </Button>
        <Button
          onClick={() => onClickOpen('action')}
          aria-haspopup="dialog"
          aria-controls="portal-action"
        >
          ActionDialog を開く
        </Button>
        <Button
          onClick={() => onClickOpen('message')}
          aria-haspopup="dialog"
          aria-controls="portal-message"
        >
          MessageDialog を開く
        </Button>
        <Button
          onClick={() => onClickOpen('modeless')}
          aria-haspopup="dialog"
          aria-controls="portal-modeless"
        >
          ModelessDialog を開く
        </Button>
      </Stack>

      <Dialog
        isOpen={isOpen === 'default'}
        onPressEscape={onClickClose}
        id="portal-default"
        ariaLabel="Dialog"
        data-test="dialog-content"
        portalParent={portalParentRef}
      >
        <Section>
          <Heading>Dialog</Heading>
          <p>Dialog を近接要素に生成しています。</p>
        </Section>
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
        <FooterCluster>
          <Button onClick={onClickClose} data-test="dialog-closer">
            閉じる
          </Button>
        </FooterCluster>
      </Dialog>
      <ActionDialog
        isOpen={isOpen === 'action'}
        title="ActionDialog"
        actionText="保存"
        onClickAction={(closeDialog) => {
          action('executed')()
          closeDialog()
        }}
        onClickClose={onClickClose}
        id="portal-action"
        portalParent={portalParentRef}
      >
        <p>ActionDialog を近接要素に生成しています</p>
      </ActionDialog>
      <MessageDialog
        isOpen={isOpen === 'message'}
        title="MessageDialog"
        description={<p>MessageDialog を近接要素に生成しています</p>}
        onClickClose={onClickClose}
        id="portal-message"
        portalParent={portalParentRef}
      />
      <ModelessDialog
        isOpen={isOpen === 'modeless'}
        // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
        header={<Heading tag="h2">ModelessDialog</Heading>}
        onClickClose={onClickClose}
        onPressEscape={onClickClose}
        id="portal-modeless"
        portalParent={portalParentRef}
      >
        <p>ModelessDialog を近接要素に生成しています。</p>
      </ModelessDialog>
    </div>
  )
}

const RadioListCluster = styled(Cluster).attrs({ gap: 1.25 })`
  list-style: none;
`
const FooterCluster = styled(Cluster).attrs({ justify: 'flex-end' })`
  ${({ theme: { border, space } }) => css`
    padding: ${space(1)} ${space(1.5)};
    border-top: ${border.shorthand};
  `}
`
const TriggerList = styled.ul`
  margin: 0;
  padding: 0;
  & > li {
    display: inline-block;
    margin: 8px;
  }
`
