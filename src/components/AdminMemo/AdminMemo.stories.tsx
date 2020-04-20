import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { AdminMemo } from './AdminMemo'
import readme from './README.md'

const sampleItems = [
  {
    text: 'コメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
    editOnClick: action('click!!'),
  },
  {
    text: 'コメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
    editOnClick: action('click!'),
  },
  {
    text: 'コメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
    editOnClick: action('click!'),
  },
]

storiesOf('AdminMemo', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <AdminMemo title="管理者メモ" items={sampleItems} onClickSubmit={action('submit!')} />
  ))
