import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import React, { ComponentProps, useRef, useState } from 'react'
import styled from 'styled-components'

import { Button } from '../Button'
import { CheckBox } from '../CheckBox'
import { DatePicker } from '../DatePicker'
import { Heading } from '../Heading'
import { Input } from '../Input'
import { Cluster, LineUp, Stack } from '../Layout'
import { RadioButton } from '../RadioButton'
import { Section } from '../SectioningContent'
import { Body, Cell, Head, Row, Table } from '../Table'

import {
  ActionDialog,
  ActionDialogContent,
  ActionDialogWithTrigger,
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
  RemoteTriggerActionDialog,
  RemoteTriggerFormDialog,
  RemoteTriggerMessageDialog,
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

export const Default: Story = () => {
  const [opened, setOpended] = useState<'default' | 'focus' | null>(null)
  const [value, setValue] = useState('Apple')
  const [date, setDate] = useState<Date | null>(null)
  const onClickClose = () => setOpended(null)
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <TriggerList>
      <li>
        <Button
          onClick={() => setOpended('default')}
          aria-haspopup="dialog"
          aria-controls="dialog-default"
          data-test="dialog-trigger"
        >
          Dialog
        </Button>
        <Dialog
          isOpen={opened === 'default'}
          onClickOverlay={onClickClose}
          onPressEscape={onClickClose}
          id="dialog-default"
          ariaLabel="Dialog"
          data-test="dialog-content"
        >
          <Section>
            <Heading>Dialog</Heading>
            <Description>
              The value of isOpen must be managed by you, but you can customize content freely.
            </Description>
            <Content>
              <DatePicker
                name="dialog_datepicker"
                value={date?.toDateString()}
                formatDate={(_date) => (_date ? _date.toDateString() : '')}
                onChangeDate={(_date) => setDate(_date)}
                data-test="dialog-datepicker"
              />
            </Content>
            <RadioList>
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
            </RadioList>
          </Section>
          <Footer>
            <Button onClick={onClickClose} data-test="dialog-closer">
              close
            </Button>
          </Footer>
        </Dialog>
      </li>
      <li>
        <Button
          onClick={() => setOpended('focus')}
          aria-haspopup="dialog"
          aria-controls="dialog-focus"
          data-test="dialog-focus-trigger"
        >
          特定の要素をフォーカス
        </Button>
        <Dialog
          isOpen={opened === 'focus'}
          onClickOverlay={onClickClose}
          onPressEscape={onClickClose}
          firstFocusTarget={inputRef}
          id="dialog-focus"
          ariaLabel="特定の要素をフォーカスするダイアログ"
        >
          <Section>
            <Heading>特定の要素をフォーカスするダイアログ</Heading>
            <Content>
              <Input ref={inputRef} name="input_focus_target" data-test="input-focus-target" />
            </Content>
          </Section>
          <Footer>
            <Button onClick={onClickClose} data-test="dialog-closer">
              close
            </Button>
          </Footer>
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

export const Message_Dialog: Story = () => {
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
      >
        MessageDialog
      </Button>
      <MessageDialog
        isOpen={isOpen}
        title="MessageDialog"
        subtitle="副題"
        description={
          <Section>
            <Heading>MessageDialog</Heading>
            <p>{dummyText} </p>
          </Section>
        }
        onClickClose={onClickClose}
        onClickOverlay={onClickClose}
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

export const Action_Dialog: Story = () => {
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
      >
        <Section>
          <StyledHeading>ActionDialog</StyledHeading>
          <Buttons>
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
          </Buttons>
        </Section>
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
          onClickOverlay={onClickClose}
          decorators={{ closeButtonLabel: (txt) => `close.(${txt})` }}
          firstFocusTarget={openedFocusRef}
          data-test="opened-dialog"
        >
          <div style={{ padding: '2rem' }}>
            <Stack align="flex-start">
              <code>isOpen=true</code> の状態で DOM に投入した場合のダイアログ
            </Stack>
          </div>
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

export const Form_Dialog: Story = () => {
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
      >
        FormDialog
      </Button>
      <FormDialog
        isOpen={openedDialog === 'normal'}
        title="FormDialog"
        subtitle="副題"
        actionText="保存"
        decorators={{ closeButtonLabel: (txt) => `cancel.(${txt})` }}
        onSubmit={(closeDialog) => {
          action('executed')()
          setResponseMessage(undefined)
          closeDialog()
        }}
        onClickClose={onClickClose}
        responseMessage={responseMessage}
        id="dialog-form"
        data-test="form-dialog-content"
      >
        <RadioList>
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
        </RadioList>
        <Buttons>
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
        </Buttons>
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
          onClickOverlay={onClickClose}
          decorators={{ closeButtonLabel: (txt) => `close.(${txt})` }}
          firstFocusTarget={openedFocusRef}
          data-test="opened-form-dialog"
        >
          <div style={{ padding: '2rem' }}>
            <Stack align="flex-start">
              <code>isOpen=true</code> の状態で DOM に投入した場合のダイアログ
              <Input
                ref={openedFocusRef}
                name="opened_dialog_focus_target"
                data-test="opened-form-dialog-focus-target"
              />
            </Stack>
          </div>
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

const Buttons = styled.div`
  padding: 1rem 1.5rem;

  > button + button {
    margin-left: 0.5rem;
  }
`

export const Action_Dialog_With_Trigger: Story = () => {
  return (
    <>
      <ActionDialogWithTrigger
        trigger={<Button>open.</Button>}
        title="ActionDialog With Trigger"
        actionText="保存"
        onClickAction={(close) => {
          close()
        }}
      >
        <Description>ActionDialog with Trigger.</Description>
      </ActionDialogWithTrigger>

      <ActionDialogWithTrigger
        trigger={<Button disabled={true}>open.</Button>}
        title="Disabled ActionDialog With Trigger"
        actionText="保存"
        onClickAction={(close) => {
          close()
        }}
      >
        <Description>ActionDialog with Trigger.</Description>
      </ActionDialogWithTrigger>
    </>
  )
}

export const Remote_Trigger_Action_Dialog: Story = () => {
  return (
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
          <Description>Remote Trigger Action Dialog.</Description>
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
          <Description>Remote Trigger Action Dialog.</Description>
        </RemoteTriggerActionDialog>
      </div>
    </>
  )
}

export const Remote_Trigger_Form_Dialog: Story = () => {
  return (
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
          <Description>Remote Trigger Form Dialog.</Description>
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
          <Description>Remote Trigger Form Dialog.</Description>
        </RemoteTriggerFormDialog>
      </div>
    </>
  )
}

export const Remote_Trigger_Message_Dialog: Story = () => {
  return (
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
          description={<Description>Remote Trigger Message Dialog.</Description>}
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
          description={<Description>Remote Trigger Message Dialog.</Description>}
        />
      </div>
    </>
  )
}

export const Uncontrolled: Story = () => {
  return (
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
            <Description>Uncontrolled Dialog.</Description>
            <Content>
              <DialogCloser>
                <Button data-test="dialog-closer">Close</Button>
              </DialogCloser>
            </Content>
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
            <Description>
              The content of ActionDialogContent is freely implemented by the user as children.
              <br />
              So you need to prepare your own style.
              <br />
              When action is executed, you can specify when to close dialog. In this story, dialog
              closes one second after clicking action
            </Description>
          </ActionDialogContent>
        </DialogWrapper>
      </li>
    </TriggerList>
  )
}
Uncontrolled.parameters = {
  docs: {
    description: {
      story:
        'Uncontrolled dialogs do not need to control its state of open / close, and they handle by themselves.',
    },
  },
}

export const WidthAndPosition: Story = () => {
  return (
    <TriggerList>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <Button aria-haspopup="dialog" aria-controls="dialog-width-1">
              幅 400px
            </Button>
          </DialogTrigger>
          <DialogContent width={400} id="dialog-width-1">
            <Description>幅 400px のダイアログ</Description>
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
            <Description>幅 80% のダイアログ</Description>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <Button aria-haspopup="dialog" aria-controls="dialog-position-1">
              top-left
            </Button>
          </DialogTrigger>
          <DialogContent top={50} left={200} id="dialog-position-1">
            <Description>This Dialog is set to `top: 50px, left: 200px`.</Description>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <Button aria-haspopup="dialog" aria-controls="dialog-position-2">
              bottom-right
            </Button>
          </DialogTrigger>
          <DialogContent right={50} bottom={100} id="dialog-position-2">
            <Description>This Dialog is set to `right: 50px, bottom: 100px`.</Description>
          </DialogContent>
        </DialogWrapper>
      </li>
    </TriggerList>
  )
}
WidthAndPosition.parameters = {
  docs: {
    description: {
      story: 'The position of Dialog can be changed.',
    },
  },
}

export const WithScroll: Story = () => {
  return (
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
}
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

export const Modeless_Dialog: Story = () => {
  const [isOpen1, setIsOpen1] = useState(true)
  const [isOpen2, setIsOpen2] = useState(false)
  return (
    <TriggerList style={{ height: '200vh' }}>
      <li>
        <Button
          onClick={() => setIsOpen1(!isOpen1)}
          aria-haspopup="dialog"
          aria-controls="modeless-dialog-1"
        >
          中央表示
        </Button>
        <ModelessDialog
          isOpen={isOpen1}
          header={<ModelessHeading>モードレスダイアログ（中央表示）</ModelessHeading>}
          footer={<ModelessFooter>フッタ</ModelessFooter>}
          onClickClose={() => setIsOpen1(false)}
          onPressEscape={() => setIsOpen1(false)}
          width="50%"
          height="50%"
          id="modeless-dialog-1"
          decorators={{
            closeButtonIconAlt: (txt) => `close.(${txt})`,
            dialogHandlerAriaLabel: (txt) => `label.(${txt})`,
            dialogHandlerAriaValuetext: (txt, data) =>
              `valuetext.(${txt}: ${data?.left}, ${data?.top})`,
          }}
        >
          <ModelessContent>
            <Stack gap="S">
              <ModelessContentPart>
                <LineUp gap="S">
                  <RadioButton name="modeless_dialog_center_radio_1">ラジオボタン1</RadioButton>
                  <RadioButton name="modeless_dialog_center_radio_2">ラジオボタン2</RadioButton>
                </LineUp>
              </ModelessContentPart>
              <ModelessContentPart>
                <DatePicker name="modeless_dialog_center_datepicker" />
              </ModelessContentPart>
              <Table>
                <Head>
                  <Row>
                    <Cell>
                      <CheckBox name="modeless_dialog_center_checkbox" />
                    </Cell>
                    <Cell>テーブル見出し1</Cell>
                    <Cell>テーブル見出し2</Cell>
                    <Cell>テーブル見出し3</Cell>
                  </Row>
                </Head>
                <Body>
                  {Array.from(Array(20).keys()).map((i) => (
                    <Row key={i}>
                      <Cell>
                        <CheckBox name={`modeless_dialog_center_checkbox_${i}`} />
                      </Cell>
                      <Cell>データ1-{i}</Cell>
                      <Cell>データ2-{i}</Cell>
                      <Cell>データ3-{i}</Cell>
                    </Row>
                  ))}
                </Body>
              </Table>
            </Stack>
          </ModelessContent>
        </ModelessDialog>
      </li>
      <li>
        <Button
          onClick={() => setIsOpen2(!isOpen2)}
          data-test="dialog-trigger"
          aria-haspopup="dialog"
          aria-controls="modeless-dialog-2"
        >
          座標指定
        </Button>
        <ModelessDialog
          isOpen={isOpen2}
          header={<ModelessHeading>座標指定表示</ModelessHeading>}
          onClickClose={() => setIsOpen2(false)}
          onPressEscape={() => setIsOpen2(false)}
          bottom={100}
          right="10%"
          id="modeless-dialog-2"
          data-test="dialog"
        >
          <div style={{ margin: '1rem' }}>
            bottom: 100px
            <br /> right: 10%
          </div>
        </ModelessDialog>
      </li>
    </TriggerList>
  )
}

export const RegDialogOpenedDialog: Story = () => {
  return (
    <Dialog isOpen>
      <Description>{dummyText}</Description>
    </Dialog>
  )
}

export const RegDialogOpenedDialogWidth: Story = () => {
  return (
    <Dialog isOpen width={500}>
      <Description>{dummyText}</Description>
    </Dialog>
  )
}

export const RegDialogOpenedDialogPosition: Story = () => {
  return (
    <Dialog isOpen top={20} right={40} bottom={60} left={80}>
      <Description>{dummyText}</Description>
    </Dialog>
  )
}

export const RegOpendMessage: Story = () => {
  return (
    <MessageDialog
      isOpen={true}
      title="MessageDialog"
      description={<p>{dummyText}</p>}
      onClickClose={action('clicked close')}
    />
  )
}
RegOpendMessage.parameters = { docs: { disable: true } }

export const RegOpendAction: Story = () => {
  return (
    <ActionDialog
      isOpen={true}
      title="ActionDialog"
      actionText="保存"
      onClickAction={action('clicked action')}
      onClickClose={action('clicked close')}
    >
      <Description>
        {dummyText}
        {dummyText}
        {dummyText}
        {dummyText}
        {dummyText}
        {dummyText}
        {dummyText}
        {dummyText}
      </Description>
      <Content>
        <label>
          <input name="reg_opend_action_checkbox" type="checkbox" />
          Agree
        </label>
      </Content>
    </ActionDialog>
  )
}
RegOpendAction.parameters = { docs: { disable: true } }

export const RegOpenedModeless: Story = () => {
  return (
    <ModelessDialog
      isOpen
      header={<ModelessHeading>モードレスダイアログ</ModelessHeading>}
      footer={<ModelessFooter>フッタ</ModelessFooter>}
      height={500}
      width={600}
    >
      <div style={{ margin: '1rem' }}>
        {dummyText}
        {dummyText}
        {dummyText}
        {dummyText}
        {dummyText}
      </div>
    </ModelessDialog>
  )
}

export const Body以外のPortalParent: Story = () => {
  const [isOpen, setIsOpen] = useState<'deault' | 'actiion' | 'message' | 'modeless'>()
  const onClickOpen = (type: 'deault' | 'actiion' | 'message' | 'modeless') => setIsOpen(type)
  const onClickClose = () => setIsOpen(undefined)
  const portalParentRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={portalParentRef}>
      <Stack align="flex-start">
        <Button
          onClick={() => onClickOpen('deault')}
          aria-haspopup="dialog"
          aria-controls="portal-default"
          data-test="dialog-trigger"
        >
          Dialog を開く
        </Button>
        <Button
          onClick={() => onClickOpen('actiion')}
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
        isOpen={isOpen === 'deault'}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        id="portal-default"
        ariaLabel="Dialog"
        data-test="dialog-content"
        portalParent={portalParentRef}
      >
        <Section>
          <Heading>Dialog</Heading>
          <Content>
            <p>Dialog を近接要素に生成しています。</p>
          </Content>
        </Section>
        <Footer>
          <Button onClick={onClickClose} data-test="dialog-closer">
            閉じる
          </Button>
        </Footer>
      </Dialog>
      <ActionDialog
        isOpen={isOpen === 'actiion'}
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
        <Content>
          <p>ActionDialog を近接要素に生成しています</p>
        </Content>
      </ActionDialog>
      <MessageDialog
        isOpen={isOpen === 'message'}
        title="MessageDialog"
        description={<p>MessageDialog を近接要素に生成しています</p>}
        onClickClose={onClickClose}
        onClickOverlay={onClickClose}
        id="portal-message"
        portalParent={portalParentRef}
      />
      <ModelessDialog
        isOpen={isOpen === 'modeless'}
        header={<ModelessHeading>ModelessDialog</ModelessHeading>}
        onClickClose={onClickClose}
        onPressEscape={onClickClose}
        id="portal-modeless"
        portalParent={portalParentRef}
      >
        <Content>
          <p>ModelessDialog を近接要素に生成しています。</p>
        </Content>
      </ModelessDialog>
    </div>
  )
}

const Description = styled.p`
  margin: 16px 24px;
  line-height: 1.5;
`
const Content = styled.div`
  margin: 16px 24px;
  line-height: 1.5;
`
const StyledHeading = styled(Heading)`
  margin: 8px 24px;
`
const RadioList = styled.ul`
  margin: 16px 24px;
  padding: 0;
  list-style: none;
`
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: ${({ theme }) => theme.border.shorthand};

  & > *:not(:first-child) {
    margin-left: 16px;
  }
`
const TriggerList = styled.ul`
  margin: 0;
  padding: 0;

  & > li {
    display: inline-block;
    margin: 8px;
  }
`
const ModelessHeading = styled(Heading)`
  font-size: 1em;
  margin: 0;
  font-weight: normal;
`
const ModelessContent = styled.div`
  margin: 1rem 0;
`
const ModelessContentPart = styled.div`
  margin: 0 1rem;
`
const ModelessFooter = styled.div`
  padding: 1rem;
`
