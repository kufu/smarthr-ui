import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Pagination } from './Pagination'

storiesOf('Pagination', module).add('all', () => (
  <List>
    <li>
      <Txt>default</Txt>
      <Pagination current={7} total={13} onClick={action('click!!')} />
    </li>
    <li>
      <Txt>padding = 1</Txt>
      <Pagination current={7} total={13} onClick={action('click!!')} padding={1} />
    </li>
    <li>
      <Txt>current = 1, total = 5</Txt>
      <Pagination current={1} total={5} onClick={action('click!!')} />
    </li>
    <li>
      <Txt>current = 5, total = 5</Txt>
      <Pagination current={5} total={5} onClick={action('click!!')} />
    </li>
    <li>
      <Txt>current = 2, total = 3</Txt>
      <Pagination current={2} total={3} onClick={action('click!!')} />
    </li>
    <li>
      <Txt>current = 1, total = 2</Txt>
      <Pagination current={1} total={2} onClick={action('click!!')} />
    </li>
    <li>
      <Txt>current = 1, total = 1</Txt>
      <Pagination current={1} total={1} onClick={action('click!!')} />
    </li>
  </List>
))

const List = styled.ul`
  padding: 0 20px;

  & > li {
    list-style: none;

    &:not(:first-child) {
      margin-top: 20px;
    }
  }
`
const Txt = styled.p`
  margin: 0 0 10px 0;
  font-size: 16px;
`
