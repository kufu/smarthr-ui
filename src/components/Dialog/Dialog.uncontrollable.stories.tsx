import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React, { useState } from 'react'
import styled from 'styled-components'

import { SecondaryButton } from '../Button'
import { RadioButtonLabel } from '../RadioButtonLabel'
import {
  DialogWrapper,
  DialogTrigger,
  DialogContent,
  DialogCloser,
  MessageDialogContent,
  ActionDialogContent,
} from '.'
import readme from './README.md'

const FormDialog: React.FC = () => {
  const [value, setValue] = useState('hoge')
  const [text, setText] = useState('')
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const onChangeText = (txt: string) => setText(txt)

  return (
    <DialogWrapper>
      <DialogTrigger>
        <SecondaryButton>Dialog</SecondaryButton>
      </DialogTrigger>
      <DialogContent>
        <Inner>
          <ul>
            <li>
              <RadioButtonLabel
                name="hoge"
                label="hoge"
                checked={value === 'hoge'}
                onChange={onChangeValue}
              />
            </li>
            <li>
              <RadioButtonLabel
                name="fuga"
                label="fuga"
                checked={value === 'fuga'}
                onChange={onChangeValue}
              />
            </li>
            <li>
              <RadioButtonLabel
                name="piyo"
                label="piyo"
                checked={value === 'piyo'}
                onChange={onChangeValue}
              />
            </li>
            <li>
              <input name="test" value={text} onChange={e => onChangeText(e.currentTarget.value)} />
            </li>
          </ul>
          <DialogCloser>
            <SecondaryButton>close</SecondaryButton>
          </DialogCloser>
        </Inner>
      </DialogContent>
    </DialogWrapper>
  )
}

storiesOf('Dialog', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('uncontrollable', () => (
    <List>
      <li>
        <FormDialog />
      </li>
      <li>
        <DialogWrapper>
          <DialogTrigger>
            <SecondaryButton>
              Modal position can be changed. top: 50px, left: 200px.
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
              <br />
              When action is executed, you can specify when to close dialog. In this story, dialog
              closes one second after clicking action
            </ActionDialogInner>
          </ActionDialogContent>
        </DialogWrapper>
      </li>
    </List>
  ))

const List = styled.ul`
  margin: 0;
  padding: 16px;

  & > li {
    display: inline-block;
    margin: 8px;
  }
`
const Inner = styled.div`
  padding: 16px;
`
const Text = styled.p`
  margin-bottom: 16px;
  font-size: 16px;
  text-align: center;
`
const ActionDialogInner = styled.p`
  padding: 16px 24px;
  font-size: 14px;
  line-height: 1.5;
`
