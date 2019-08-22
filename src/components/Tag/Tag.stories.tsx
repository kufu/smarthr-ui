import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Tag } from './Tag'
import readme from './README.md'

storiesOf('Tag', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <ListWrapper>
      <List>
        <li>
          <Tag type="done">done</Tag>
        </li>
        <li>
          <Tag type="success">success</Tag>
        </li>
        <li>
          <Tag type="process">process</Tag>
        </li>
        <li>
          <Tag type="required">required</Tag>
        </li>
      </List>
      <List>
        <li>
          <Tag type="disabled">disabled</Tag>
        </li>
        <li>
          <Tag type="must">must</Tag>
        </li>
        <li>
          <Tag type="warning">warning</Tag>
        </li>
        <li>
          <Tag type="error">error</Tag>
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
