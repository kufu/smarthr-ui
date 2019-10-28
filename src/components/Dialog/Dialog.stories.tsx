import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { SecondaryButton } from '../Button'
import { Dialog, DialogTrigger, DialogContent, DialogCloser } from './'

storiesOf('Dialog', module).add('all', () => (
  <List>
    <li>
      <Dialog>
        <DialogTrigger>
          <SecondaryButton>Controllable Dialog</SecondaryButton>
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
