import { Story } from '@storybook/react'
import React, { useState } from 'react'
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
} from '.'
import { Theme, useTheme } from '../../hooks/useTheme'
import { SecondaryButton } from '../Button'
import { RadioButtonLabel } from '../RadioButtonLabel'
import { DatePicker } from '../DatePicker'

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
      <SecondaryButton onClick={onClickOpen} aria-haspopup="dialog" aria-controls="dialog-default">
        Dialog
      </SecondaryButton>
      <Dialog
        isOpen={isOpen}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        id="dialog-default"
        ariaLabel="Dialog"
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
            <RadioButtonLabel
              name="Apple"
              label="Apple"
              checked={value === 'Apple'}
              onChange={onChangeValue}
            />
          </li>
          <li>
            <RadioButtonLabel
              name="Orange"
              label="Orange"
              checked={value === 'Orange'}
              onChange={onChangeValue}
            />
          </li>
          <li>
            <RadioButtonLabel
              name="Grape"
              label="Grape"
              checked={value === 'Grape'}
              onChange={onChangeValue}
            />
          </li>
        </RadioList>
        <Footer themes={themes}>
          <SecondaryButton onClick={onClickClose}>close</SecondaryButton>
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
      <SecondaryButton onClick={onClickOpen} aria-haspopup="dialog" aria-controls="dialog-message">
        MessageDialog
      </SecondaryButton>
      <MessageDialog
        isOpen={isOpen}
        title="MessageDialog"
        description={<p>{dummyText} </p>}
        closeText="Close"
        onClickClose={onClickClose}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        id="dialog-message"
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
  const onClickOpen = () => setIsOpen(true)
  const onClickClose = () => setIsOpen(false)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)

  return (
    <>
      <SecondaryButton onClick={onClickOpen} aria-haspopup="dialog" aria-controls="dialog-action">
        ActionDialog
      </SecondaryButton>
      <ActionDialog
        isOpen={isOpen}
        title="ActionDialog"
        closeText="Close"
        actionText="Execute"
        actionTheme="primary"
        onClickAction={(closeDialog) => {
          action('executed')()
          closeDialog()
        }}
        onClickClose={onClickClose}
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        id="dialog-action"
      >
        <RadioList>
          <li>
            <RadioButtonLabel
              name="Apple"
              label="Apple"
              checked={value === 'Apple'}
              onChange={onChange}
            />
          </li>
          <li>
            <RadioButtonLabel
              name="Orange"
              label="Orange"
              checked={value === 'Orange'}
              onChange={onChange}
            />
          </li>
          <li>
            <RadioButtonLabel
              name="Grape"
              label="Grape"
              checked={value === 'Grape'}
              onChange={onChange}
            />
          </li>
        </RadioList>
      </ActionDialog>
    </>
  )
}
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
            <SecondaryButton aria-haspopup="dialog" aria-controls="dialog-uncontrolled">
              Dialog
            </SecondaryButton>
          </DialogTrigger>
          <DialogContent id="dialog-uncontrolled">
            <Description>Uncontrolled Dialog.</Description>
            <Content>
              <DialogCloser>
                <SecondaryButton>Close</SecondaryButton>
              </DialogCloser>
            </Content>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton aria-haspopup="dialog" aria-controls="dialog-uncontrolled-message">
              MessageDialog
            </SecondaryButton>
          </DialogTrigger>
          <MessageDialogContent
            title="Uncontrolled Message Dialog"
            description={<p>{dummyText} </p>}
            closeText="Close"
            id="dialog-uncontrolled-message"
          />
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton aria-haspopup="dialog" aria-controls="dialog-uncontrolled-action">
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

export const Position: Story = () => {
  return (
    <TriggerList>
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
Position.parameters = {
  docs: {
    description: {
      story: 'The position of Dialog can be changed.',
    },
  },
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

const Title = styled.p<{ themes: Theme }>`
  padding: 16px 24px;
  margin: 0;
  font-size: 18px;
  line-height: 1;
  border-bottom: ${({ themes }) => themes.frame.border.default};
`
const Description = styled.p`
  margin: 16px 24px;
  font-size: 14px;
  line-height: 1.5;
`
const Content = styled.div`
  margin: 16px 24px;
  font-size: 14px;
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
  border-top: ${({ themes }) => themes.frame.border.default};

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
