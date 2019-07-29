import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { HeaderButton } from './HeaderButton'
import { FaPlusCircle } from 'react-icons/fa'

import styled from 'styled-components'

storiesOf('HeaderButton', module).add('all', () => (
  <List>
    <li>
      <HeaderButton url="#" icon={<FaPlusCircle />}>
        ヘッダーボタン
      </HeaderButton>
    </li>
  </List>
))

// const SampleMenus = [
//   {
//     menu_title: `hoge1`,
//     menu_url: '#1',
//   },
//   {
//     menu_title: `hoge2`,
//     menu_url: '#2',
//   },
//   {
//     menu_title: `hoge3`,
//     menu_url: '#4',
//   },
// ]

const List = styled.ul`
  display: block;
  padding: 0;
  margin: 0;

  & > li {
    display: inline-block;
    padding: 0 1rem;
    margin: 0 1rem 1rem 0;
    background-color: #00c4cc;
  }
`
