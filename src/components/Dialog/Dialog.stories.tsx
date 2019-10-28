import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { SecondaryButton } from '../Button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogCloser,
  MessageDialogContent,
  ActionDialogContent,
} from './'

storiesOf('Dialog', module).add('uncontrollable', () => (
  <List>
    <li>
      <Dialog>
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
      </Dialog>
    </li>
    <li>
      <Dialog>
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
      </Dialog>
    </li>
    <li>
      <Dialog>
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
      </Dialog>
    </li>
    <li>
      <Dialog>
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
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
              <br />
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
              <br />
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          }
          closeText="close"
        />
      </Dialog>
    </li>
    <li>
      <Dialog>
        <DialogTrigger>
          <SecondaryButton>ActionDialog</SecondaryButton>
        </DialogTrigger>
        <ActionDialogContent
          title="Title Message"
          closeText="close"
          actionText="execute"
          actionTheme="primary"
          disabledAction={false}
          onClickAction={action('executed')}
        >
          <ActionDialogInner>
            The content of ActionDialogContent is freely implemented by the user as children.
            <br />
            So you need to prepare your own style.
          </ActionDialogInner>
        </ActionDialogContent>
      </Dialog>
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
