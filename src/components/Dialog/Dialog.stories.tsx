import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React, { useState } from 'react'
import styled from 'styled-components'

import { SecondaryButton } from '../Button'
import { RadioLabel } from '../RadioLabel'
import {
  Dialog,
  DialogWrapper,
  DialogTrigger,
  DialogContent,
  DialogCloser,
  MessageDialogContent,
  ActionDialogContent,
} from './'

const DialogController: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = React.useState('hoge')
  const onClickOpen = () => setIsOpen(true)
  const onClickClose = () => setIsOpen(false)
  const onChange = (name: string) => setValue(name)

  return (
    <div>
      <SecondaryButton onClick={onClickOpen}>Dialog</SecondaryButton>
      <Dialog isOpen={isOpen} onClickOverlay={onClickClose}>
        <DialogControllerTitle>Dialog</DialogControllerTitle>
        <DialogControllerBox>
          <li>
            <RadioLabel name="hoge" label="hoge" checked={value === 'hoge'} onChange={onChange} />
          </li>
          <li>
            <RadioLabel name="fuga" label="fuga" checked={value === 'fuga'} onChange={onChange} />
          </li>
          <li>
            <RadioLabel name="piyo" label="piyo" checked={value === 'piyo'} onChange={onChange} />
          </li>
        </DialogControllerBox>
        <DialogControllerBottom>
          <SecondaryButton onClick={onClickClose}>close</SecondaryButton>
        </DialogControllerBottom>
      </Dialog>
    </div>
  )
}

storiesOf('Dialog', module)
  .add('uncontrollable', () => (
    <List>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton>Dialog</SecondaryButton>
          </DialogTrigger>
          <DialogContent>
            <Inner>
              <Text>Rendered!!</Text>
              <DialogCloser>
                <SecondaryButton>close</SecondaryButton>
              </DialogCloser>
            </Inner>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton>
              Change the positoin of the modal. top: 50px, left: 200px.
            </SecondaryButton>
          </DialogTrigger>
          <DialogContent top={50} left={200}>
            <Inner>
              <Text>Rendered!!</Text>
              <DialogCloser>
                <SecondaryButton>close</SecondaryButton>
              </DialogCloser>
            </Inner>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton>right: 50px, bottom: 100px.</SecondaryButton>
          </DialogTrigger>
          <DialogContent right={50} bottom={100}>
            <Inner>
              <Text>Rendered!!</Text>
              <DialogCloser>
                <SecondaryButton>close</SecondaryButton>
              </DialogCloser>
            </Inner>
          </DialogContent>
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton>MessageDialog</SecondaryButton>
          </DialogTrigger>
          <MessageDialogContent
            title="Title Message"
            description={
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
                <br />
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
                <br />
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
                <br />
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            }
            closeText="close"
          />
        </DialogWrapper>
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton>ActionDialog</SecondaryButton>
          </DialogTrigger>
          <ActionDialogContent
            title="Title Message"
            closeText="close"
            actionText="execute"
            actionTheme="primary"
            actionDisabled={false}
            onClickAction={closeDialog => {
              action('executed')()
              setTimeout(closeDialog, 1000)
            }}
          >
            <ActionDialogInner>
              The content of ActionDialogContent is freely implemented by the user as children.
              <br />
              So you need to prepare your own style.
            </ActionDialogInner>
          </ActionDialogContent>
        </DialogWrapper>
      </li>
    </List>
  ))
  .add('controllable', () => (
    <List>
      <li>
        <DialogController />
      </li>
    </List>
  ))

const List = styled.ul`
  margin: 0;
  padding: 1.6rem;

  & > li {
    display: inline-block;
    margin: 0.8rem;
  }
`
const Inner = styled.div`
  padding: 1.6rem;
`
const Text = styled.p`
  margin-bottom: 1.6rem;
  font-size: 16px;
  text-align: center;
`
const ActionDialogInner = styled.p`
  padding: 16px 24px;
  font-size: 14px;
  line-height: 1.5;
`
const DialogControllerTitle = styled.p`
  padding: 16px 24px;
  margin: 0;
  font-size: 18px;
  line-height: 1;
  border-bottom: 1px solid #d6d6d6;
`
const DialogControllerBox = styled.ul`
  margin: 0;
  padding: 16px 24px;
  width: 200px;
  list-style: none;

  & > li {
    padding: 0;
  }
`
const DialogControllerBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #d6d6d6;

  & > *:not(:first-child) {
    margin-left: 16px;
  }
`
