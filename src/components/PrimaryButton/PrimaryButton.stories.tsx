import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Button, ButtonAnchor, ButtonDiv } from './PrimaryButton'

storiesOf('PrimaryButton', module).add('all', () => (
  <List>
    <li>
      <Button onClick={action('click button!')}>button element</Button>
      <ButtonAnchor href="https://google.com" target="_blank">
        anchor element
      </ButtonAnchor>
      <ButtonDiv onClick={action('click button!')}>div element</ButtonDiv>
    </li>
    <li>
      <Button onClick={action('click button!')} size="s">
        Size S
      </Button>
      <Button onClick={action('click button!')} size="m">
        Size M
      </Button>
      <Button onClick={action('click button!')} size="l">
        Size L
      </Button>
    </li>
    <li>
      <Button onClick={action('click button!')} type="primary">
        Primary
      </Button>
      <Button onClick={action('click button!')} type="danger">
        Danger
      </Button>
      <Button onClick={action('click button!')} type="sub-a">
        sub-a
      </Button>
    </li>
    <li>
      <Button onClick={action('click button!')} type="sub-b">
        sub-b
      </Button>
      <Background>
        <Button onClick={action('click button!')} type="sub-c">
          sub-c
        </Button>
      </Background>
      <Button onClick={action('click button!')} disabled>
        Disabled
      </Button>
    </li>
    <li>
      <Button onClick={action('click button!')} full>
        Full Size
      </Button>
    </li>
  </List>
))

const List = styled.ul`
  padding: 0 2.4rem;
  list-style: none;

  & > li {
    &:not(:first-child) {
      margin-top: 2.4rem;
    }

    & > *:not(:first-child) {
      margin-left: 1.6rem;
    }
  }
`
const Background = styled.div`
  display: inline-block;
  padding: 0.8rem;
  background-color: #0dbac1;
`
