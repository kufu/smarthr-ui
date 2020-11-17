import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { StatusLabel } from './StatusLabel'
import readme from './README.md'

storiesOf('StatusLabel', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <ListWrapper>
      <List>
        <li>
          <StatusLabel type="done">完了</StatusLabel>
        </li>
        <li>
          <StatusLabel type="success">入力完了</StatusLabel>
        </li>
        <li>
          <StatusLabel type="process">入力中</StatusLabel>
        </li>
        <li>
          <StatusLabel type="required">入力必要</StatusLabel>
        </li>
      </List>
      <List>
        <li>
          <StatusLabel type="disabled">不可</StatusLabel>
        </li>
        <li>
          <StatusLabel type="must">必読</StatusLabel>
        </li>
        <li>
          <StatusLabel type="warning">警告</StatusLabel>
        </li>
        <li>
          <StatusLabel type="error">エラー</StatusLabel>
        </li>
      </List>
    </ListWrapper>
  ))

const ListWrapper = styled.div`
  padding: 0 24px;
`

const List = styled.ul`
  display: flex;
  padding: 0;
  margin: 0 0 24px;

  > li {
    display: block;
    margin-right: 16px;
  }
`
