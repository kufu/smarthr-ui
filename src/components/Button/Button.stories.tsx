import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Button, ButtonAnchor, ButtonDiv } from './Button'

storiesOf('Button', module).add('all', () => (
  <List>
    <li>
      <Button onClick={action('click button!')}>button タグ</Button>
      <ButtonAnchor href="https://google.com" target="_blank">
        a タグ
      </ButtonAnchor>
      <ButtonDiv onClick={action('click button!')}>div タグ</ButtonDiv>
    </li>
    <li>
      <Button onClick={action('click button!')} size="s">
        Sサイズ
      </Button>
      <Button onClick={action('click button!')} size="m">
        Mサイズ
      </Button>
      <Button onClick={action('click button!')} size="l">
        Lサイズ
      </Button>
    </li>
    <li>
      <Button onClick={action('click button!')} type="primary">
        primaryカラー
      </Button>
      <Button onClick={action('click button!')} type="danger">
        dangerカラー
      </Button>
      <Button onClick={action('click button!')} type="sub-a">
        sub-aカラー
      </Button>
    </li>
    <li>
      <Button onClick={action('click button!')} type="sub-b">
        sub-bカラー
      </Button>
      <Background>
        <Button onClick={action('click button!')} type="sub-c">
          sub-cカラー
        </Button>
      </Background>
      <Button onClick={action('click button!')} disabled>
        disabled
      </Button>
    </li>
    <li>
      <Button onClick={action('click button!')} full>
        フルサイズ
      </Button>
    </li>
  </List>
))

const List = styled.ul`
  padding: 0 2.4rem;

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
