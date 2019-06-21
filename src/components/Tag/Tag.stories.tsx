import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Tag } from './Tag'

storiesOf('Tag', module).add('all', () => (
  <List>
    <li>
      <Tag type="success">サクセス</Tag>
    </li>
    <li>
      <Tag type="warning">警告</Tag>
    </li>
    <li>
      <Tag type="error">エラー</Tag>
    </li>
    <li>
      <Tag type="require">必須</Tag>
    </li>
  </List>
))

const List = styled.ul`
  padding: 8px 24px;
  list-style: none;
`
