import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Balloon } from './Balloon'

export default {
  title: 'Data Display（データ表示）/Balloon',
  component: Balloon,
}

export const All: StoryFn = () => (
  <List>
    <li>
      <Balloon horizontal="left" vertical="top">
        <Txt>top left</Txt>
      </Balloon>
      <Balloon horizontal="center" vertical="top">
        <Txt>top center</Txt>
      </Balloon>
      <Balloon horizontal="right" vertical="top">
        <Txt>top right</Txt>
      </Balloon>
    </li>
    <li>
      <Balloon horizontal="left" vertical="bottom">
        <Txt>bottom left</Txt>
      </Balloon>
      <Balloon horizontal="center" vertical="bottom">
        <Txt>bottom center</Txt>
      </Balloon>
      <Balloon horizontal="right" vertical="bottom">
        <Txt>bottom right</Txt>
      </Balloon>
    </li>
    <li>
      <Balloon horizontal="left" vertical="middle">
        <Txt>middle left</Txt>
      </Balloon>
      <Balloon horizontal="right" vertical="middle">
        <Txt>middle right</Txt>
      </Balloon>
    </li>
  </List>
)
All.storyName = 'all'

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
