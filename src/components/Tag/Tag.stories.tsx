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
    <List>
      <li>
        <Tag>デフォルト</Tag>
      </li>
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
      <li>
        <Tag type="success" skeleton={true}>
          サクセス
        </Tag>
      </li>
      <li>
        <Tag type="warning" skeleton={true}>
          警告
        </Tag>
      </li>
      <li>
        <Tag type="error" skeleton={true}>
          エラー
        </Tag>
      </li>
      <li>
        <Tag type="require" skeleton={true}>
          必須
        </Tag>
      </li>
    </List>
  ))

const List = styled.ul`
  padding: 8px 24px;
  list-style: none;
`
