import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { AppNavi } from './AppNavi'

const buttons = [
  {
    children: 'ボタン1',
    icon: 'fa-file' as const,
    current: true,
  },
  {
    children: 'ボタン2',
    icon: 'fa-user-alt' as const,
    onClick: action('click!!'),
  },
  {
    children: 'ボタン3',
    icon: 'fa-cog' as const,
    onClick: action('click!!'),
  },
]

storiesOf('AppNavi', module).add('all', () => (
  <React.Fragment>
    <Wrapper>
      <Description>No child component</Description>
      <AppNavi label="プラスメニュー" buttons={buttons} />
    </Wrapper>
    <Wrapper>
      <Description>With a child component</Description>
      <AppNavi label="プラスメニュー" buttons={buttons}>
        <ChildComponent>Some child component</ChildComponent>
      </AppNavi>
    </Wrapper>
  </React.Fragment>
))

const Wrapper = styled.div`
  padding-top: 16px;
`

const Description = styled.p`
  margin-bottom: 8px;
  padding: 0 20px;
`

const ChildComponent = styled.p`
  margin: 0 0 0 auto;
`
