import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { DarkTooltip, LightTooltip } from './Tooltip'

storiesOf('Tooltip', module).add('all', () => (
  <List>
    <li>
      <LightTooltip horizontal="center" vertical="bottom">
        <Txt>LightTooltip</Txt>
      </LightTooltip>
      <DarkTooltip horizontal="center" vertical="bottom">
        <Txt>DarkTooltip</Txt>
      </DarkTooltip>
    </li>
    <li>
      <DarkTooltip horizontal="left" vertical="top">
        <Txt>top left</Txt>
      </DarkTooltip>
      <DarkTooltip horizontal="center" vertical="top">
        <Txt>top center</Txt>
      </DarkTooltip>
      <DarkTooltip horizontal="right" vertical="top">
        <Txt>top right</Txt>
      </DarkTooltip>
    </li>
    <li>
      <LightTooltip horizontal="left" vertical="bottom">
        <Txt>bottom left</Txt>
      </LightTooltip>
      <LightTooltip horizontal="center" vertical="bottom">
        <Txt>bottom center</Txt>
      </LightTooltip>
      <LightTooltip horizontal="right" vertical="bottom">
        <Txt>bottom right</Txt>
      </LightTooltip>
    </li>
    <li>
      <DarkTooltip horizontal="left" vertical="middle">
        <Txt>middle left</Txt>
      </DarkTooltip>
      <DarkTooltip horizontal="right" vertical="middle">
        <Txt>middle right</Txt>
      </DarkTooltip>
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
  padding: 5px 10px;
`
