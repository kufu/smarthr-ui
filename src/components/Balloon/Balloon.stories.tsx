import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { DarkBalloon, LightBalloon } from './Balloon'

import readme from './README.md'

storiesOf('Balloon', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <List>
      <li>
        <LightBalloon horizontal="center" vertical="bottom">
          <Txt>LightBalloon</Txt>
        </LightBalloon>
        <DarkBalloon horizontal="center" vertical="bottom">
          <Txt>DarkBalloon</Txt>
        </DarkBalloon>
      </li>
      <li>
        <DarkBalloon horizontal="left" vertical="top">
          <Txt>top left</Txt>
        </DarkBalloon>
        <DarkBalloon horizontal="center" vertical="top">
          <Txt>top center</Txt>
        </DarkBalloon>
        <DarkBalloon horizontal="right" vertical="top">
          <Txt>top right</Txt>
        </DarkBalloon>
      </li>
      <li>
        <LightBalloon horizontal="left" vertical="bottom">
          <Txt>bottom left</Txt>
        </LightBalloon>
        <LightBalloon horizontal="center" vertical="bottom">
          <Txt>bottom center</Txt>
        </LightBalloon>
        <LightBalloon horizontal="right" vertical="bottom">
          <Txt>bottom right</Txt>
        </LightBalloon>
      </li>
      <li>
        <DarkBalloon horizontal="left" vertical="middle">
          <Txt>middle left</Txt>
        </DarkBalloon>
        <DarkBalloon horizontal="right" vertical="middle">
          <Txt>middle right</Txt>
        </DarkBalloon>
      </li>
    </List>
  ))

const List = styled.ul`
  padding-left: 20px;

  & > li {
    display: flex;
    justify-content: flex-start;
    & > *:not(:first-child) {
      margin-left: 10px;
    }
  }
  & > li:not(:first-child) {
    margin-top: 20px;
  }
`
const Txt = styled.p`
  margin: 0;
  padding: 8px;
`
