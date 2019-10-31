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
          <StatusLabel type="done">done</StatusLabel>
        </li>
        <li>
          <StatusLabel type="success">success</StatusLabel>
        </li>
        <li>
          <StatusLabel type="process">process</StatusLabel>
        </li>
        <li>
          <StatusLabel type="required">required</StatusLabel>
        </li>
      </List>
      <List>
        <li>
          <StatusLabel type="disabled">disabled</StatusLabel>
        </li>
        <li>
          <StatusLabel type="must">must</StatusLabel>
        </li>
        <li>
          <StatusLabel type="warning">warning</StatusLabel>
        </li>
        <li>
          <StatusLabel type="error">error</StatusLabel>
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
