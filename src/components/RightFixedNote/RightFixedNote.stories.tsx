import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { RightFixedNote } from './RightFixedNote'
import readme from './README.md'

const sampleItems = [
  {
    id: 'id-1',
    text: 'コメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
  },
  {
    id: 'id-2',
    text: 'コメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
  },
  {
    id: 'id-3',
    text: 'コメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
  },
]

storiesOf('RightFixedNote', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <RightFixedNote
      title="RightFixedNote"
      items={sampleItems}
      onSubmit={action('submit!')}
      onClickEdit={action('click edit!!')}
    />
  ))
  .add('without title', () => (
    <RightFixedNote
      items={sampleItems}
      onSubmit={action('submit!')}
      onClickEdit={action('click edit!!')}
    />
  ))
  .add('without items', () => (
    <RightFixedNote
      title="RightFixedNote"
      onSubmit={action('submit!')}
      onClickEdit={action('click edit!!')}
    />
  ))
  .add('without title and items', () => (
    <RightFixedNote onSubmit={action('submit!')} onClickEdit={action('click edit!!')} />
  ))
  .add('without edit button', () => (
    <RightFixedNote title="RightFixedNote" items={sampleItems} onSubmit={action('submit!')} />
  ))
