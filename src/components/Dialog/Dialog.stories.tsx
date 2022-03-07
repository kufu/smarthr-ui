import { Story } from '@storybook/react'
import React, { useRef, useState } from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'

import {
  ActionDialog,
  ActionDialogContent,
  Dialog,
  DialogCloser,
  DialogContent,
  DialogTrigger,
  DialogWrapper,
  MessageDialog,
  MessageDialogContent,
  ModelessDialog,
} from '.'
import { Theme, useTheme } from '../../hooks/useTheme'
import { SecondaryButton } from '../Button'
import { RadioButton } from '../RadioButton'
import { DatePicker } from '../DatePicker'
import { LineUp, Stack } from '../Layout'
import { Body, Cell, Head, Row, Table } from '../Table'
import { CheckBox } from '../CheckBox'

import readme from './README.md'

export default {
  title: 'Dialog',
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
      description: { component: readme },
      source: {
        type: 'code',
      },
    },
  },
}

export const Default: Story = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('Apple')
  const [date, setDate] = useState<Date | null>(null)
  const onClickOpen = () => setIsOpen(true)
  const onClickClose = () => setIsOpen(false)
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const themes = useTheme()

  return (
    <>
      <SecondaryButton
        onClick={onClickOpen}
        aria-haspopup="dialog"
        aria-controls="dialog-default"
        data-test="dialog-trigger"
      >
        Dialog
      </SecondaryButton>
      <Dialog
        isOpen={isOpen}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        id="dialog-default"
        ariaLabel="Dialog"
        data-test="dialog-content"
      >
        <Title themes={themes}>Dialog</Title>
        <Description>
          The value of isOpen must be managed by you, but you can customize content freely.
        </Description>
        <Content>
          <DatePicker
            value={date?.toDateString()}
            formatDate={(_date) => (_date ? _date.toDateString() : '')}
            onChangeDate={(_date) => setDate(_date)}
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
        <Footer themes={themes}>
          <SecondaryButton onClick={onClickClose} data-test="dialog-closer">
            close
          </SecondaryButton>
        </Footer>
      </Dialog>
    </>
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
      <SecondaryButton
        onClick={onClickOpen}
        aria-haspopup="dialog"
        aria-controls="dialog-message"
        data-test="dialog-trigger"
      >
        MessageDialog
      </SecondaryButton>
      <MessageDialog
        isOpen={isOpen}
        title="MessageDialog"
        subtitle="副題"
        description={<p>{dummyText} </p>}
        closeText="Close"
        onClickClose={onClickClose}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
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
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = React.useState('Apple')
  const [responseMessage, setResponseMessage] = useState<{
    status: 'success' | 'error' | 'processing'
    text: string
  }>()
  const onClickOpen = () => setIsOpen(true)
  const onClickClose = () => {
    setIsOpen(false)
    setResponseMessage(undefined)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)

  return (
    <>
      <SecondaryButton
        onClick={onClickOpen}
        aria-haspopup="dialog"
        aria-controls="dialog-action"
        data-test="dialog-trigger"
      >
        ActionDialog
      </SecondaryButton>
      <ActionDialog
        isOpen={isOpen}
        title="ActionDialog"
        subtitle="副題"
        closeText="Close"
        actionText="Execute"
        actionTheme="primary"
        onClickAction={(closeDialog) => {
          action('executed')()
          setResponseMessage(undefined)
          closeDialog()
        }}
        onClickClose={onClickClose}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        responseMessage={responseMessage}
        id="dialog-action"
        data-test="dialog-content"
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
          <SecondaryButton
            onClick={() =>
              setResponseMessage({
                status: 'success',
                text: '保存しました。',
              })
            }
          >
            保存
          </SecondaryButton>
          <SecondaryButton
            onClick={() =>
              setResponseMessage({
                status: 'error',
                text: '何らかのエラーが発生しました。',
              })
            }
          >
            エラー
          </SecondaryButton>
          <SecondaryButton
            onClick={() =>
              setResponseMessage({
                status: 'processing',
                text: '保存中',
              })
            }
          >
            保存中
          </SecondaryButton>
        </Buttons>
      </ActionDialog>
    </>
  )
}
const Buttons = styled.div`
  margin-top: -2rem;
  padding: 1rem 1.5rem;

  > button + button {
    margin-left: 0.5rem;
  }
`
Action_Dialog.parameters = {
  docs: {
    description: {
      story: '`ActionDialog` includes an action button that used for submitting, etc.',
    },
  },
}

export const Uncontrolled: Story = () => {
  return (
    <TriggerList>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton
              aria-haspopup="dialog"
              aria-controls="dialog-uncontrolled"
              data-test="dialog-trigger"
            >
              Dialog
            </SecondaryButton>
          </DialogTrigger>
          <DialogContent id="dialog-uncontrolled" data-test="dialog-content">
            <Description>Uncontrolled Dialog.</Description>
            <Content>
              <DialogCloser>
                <SecondaryButton data-test="dialog-closer">Close</SecondaryButton>
              </DialogCloser>
            </Content>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton
              aria-haspopup="dialog"
              aria-controls="dialog-uncontrolled-message"
              data-test="message-dialog-trigger"
            >
              MessageDialog
            </SecondaryButton>
          </DialogTrigger>
          <MessageDialogContent
            title="Uncontrolled Message Dialog"
            description={<p>{dummyText} </p>}
            closeText="Close"
            id="dialog-uncontrolled-message"
            data-test="message-dialog-content"
          />
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton
              aria-haspopup="dialog"
              aria-controls="dialog-uncontrolled-action"
              data-test="action-dialog-trigger"
            >
              ActionDialog
            </SecondaryButton>
          </DialogTrigger>
          <ActionDialogContent
            title="Uncontrolled Action Dialog"
            closeText="Close"
            actionText="Execute"
            actionTheme="primary"
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
            <SecondaryButton aria-haspopup="dialog" aria-controls="dialog-width-1">
              幅 400px
            </SecondaryButton>
          </DialogTrigger>
          <DialogContent width={400} id="dialog-width-1">
            <Description>幅 400px のダイアログ</Description>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton aria-haspopup="dialog" aria-controls="dialog-width-2">
              幅 80%
            </SecondaryButton>
          </DialogTrigger>
          <DialogContent width="80%" id="dialog-width-2">
            <Description>幅 80% のダイアログ</Description>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton aria-haspopup="dialog" aria-controls="dialog-position-1">
              top-left
            </SecondaryButton>
          </DialogTrigger>
          <DialogContent top={50} left={200} id="dialog-position-1">
            <Description>This Dialog is set to `top: 50px, left: 200px`.</Description>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton aria-haspopup="dialog" aria-controls="dialog-position-2">
              bottom-right
            </SecondaryButton>
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
          <SecondaryButton aria-haspopup="dialog" aria-controls="dialog-with-scroll-1">
            Open Dialog
          </SecondaryButton>
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
        <SecondaryButton
          onClick={() => setIsOpen1(!isOpen1)}
          aria-haspopup="dialog"
          aria-controls="modeless-dialog-1"
        >
          中央表示
        </SecondaryButton>
        <ModelessDialog
          isOpen={isOpen1}
          header={<ModelessHeading>モードレスダイアログ（中央表示）</ModelessHeading>}
          footer={<ModelessFooter>フッタ</ModelessFooter>}
          onClickClose={() => setIsOpen1(false)}
          onPressEscape={() => setIsOpen1(false)}
          width="50%"
          height="50%"
          id="modeless-dialog-1"
        >
          <ModelessContent>
            <Stack gap="S">
              <ModelessContentPart>
                <LineUp gap="S">
                  <RadioButton>ラジオボタン1</RadioButton>
                  <RadioButton>ラジオボタン2</RadioButton>
                </LineUp>
              </ModelessContentPart>
              <ModelessContentPart>
                <DatePicker />
              </ModelessContentPart>
              <Table>
                <Head>
                  <Row>
                    <Cell>
                      <CheckBox />
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
                        <CheckBox />
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
        <SecondaryButton
          onClick={() => setIsOpen2(!isOpen2)}
          data-test="dialog-trigger"
          aria-haspopup="dialog"
          aria-controls="modeless-dialog-2"
        >
          座標指定
        </SecondaryButton>
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
      closeText="close"
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
      closeText="close"
      actionText="execute"
      actionTheme="primary"
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
          <input type="checkbox" />
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
  const themes = useTheme()

  return (
    <div ref={portalParentRef}>
      <Stack align="flex-start">
        <SecondaryButton
          onClick={() => onClickOpen('deault')}
          aria-haspopup="dialog"
          aria-controls="portal-default"
          data-test="dialog-trigger"
        >
          Dialog を開く
        </SecondaryButton>
        <SecondaryButton
          onClick={() => onClickOpen('actiion')}
          aria-haspopup="dialog"
          aria-controls="portal-action"
          data-test="dialog-trigger"
        >
          ActionDialog を開く
        </SecondaryButton>
        <SecondaryButton
          onClick={() => onClickOpen('message')}
          aria-haspopup="dialog"
          aria-controls="portal-message"
          data-test="dialog-trigger"
        >
          MessageDialog を開く
        </SecondaryButton>
        <SecondaryButton
          onClick={() => onClickOpen('modeless')}
          aria-haspopup="dialog"
          aria-controls="portal-modeless"
        >
          ModelessDialog を開く
        </SecondaryButton>
      </Stack>

      <Dialog
        isOpen={isOpen === 'deault'}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        id="portal-default"
        ariaLabel="Dialog"
        data-test="dialog-content"
        portalParent={portalParentRef.current || undefined}
      >
        <Title themes={themes}>Dialog</Title>
        <Content>
          <p>Dialog を近接要素に生成しています。</p>
        </Content>
        <Footer themes={themes}>
          <SecondaryButton onClick={onClickClose} data-test="dialog-closer">
            閉じる
          </SecondaryButton>
        </Footer>
      </Dialog>
      <ActionDialog
        isOpen={isOpen === 'actiion'}
        title="ActionDialog"
        closeText="閉じる"
        actionText="実行"
        actionTheme="primary"
        onClickAction={(closeDialog) => {
          action('executed')()
          closeDialog()
        }}
        onClickClose={onClickClose}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        id="portal-action"
        data-test="dialog-content"
        portalParent={portalParentRef.current || undefined}
      >
        <Content>
          <p>ActionDialog を近接要素に生成しています</p>
        </Content>
      </ActionDialog>
      <MessageDialog
        isOpen={isOpen === 'message'}
        title="MessageDialog"
        description={<p>MessageDialog を近接要素に生成しています</p>}
        closeText="閉じる"
        onClickClose={onClickClose}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        id="portal-message"
        data-test="dialog-content"
        portalParent={portalParentRef.current || undefined}
      />
      <ModelessDialog
        isOpen={isOpen === 'modeless'}
        header={<ModelessHeading>ModelessDialog</ModelessHeading>}
        onClickClose={onClickClose}
        onPressEscape={onClickClose}
        id="portal-modeless"
        portalParent={portalParentRef.current || undefined}
      >
        <Content>
          <p>ModelessDialog を近接要素に生成しています。</p>
        </Content>
      </ModelessDialog>
    </div>
  )
}

const Title = styled.p<{ themes: Theme }>`
  padding: 16px 24px;
  margin: 0;
  font-size: ${({ themes }) => themes.fontSize.L};
  line-height: 1;
  border-bottom: ${({ themes }) => themes.border.shorthand};
`
const Description = styled.p`
  margin: 16px 24px;
  line-height: 1.5;
`
const Content = styled.div`
  margin: 16px 24px;
  line-height: 1.5;
`
const RadioList = styled.ul`
  margin: 16px 24px;
  padding: 0;
  list-style: none;
`
const Footer = styled.div<{ themes: Theme }>`
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: ${({ themes }) => themes.border.shorthand};

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
const ModelessHeading = styled.h3`
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
