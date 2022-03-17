import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import * as React from 'react'
import { RightFixedNote } from './RightFixedNote'
import readme from './README.md'

export default {
  title: 'RightFixedNote',
  component: RightFixedNote,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

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

export const All: Story = () => (
  <RightFixedNote
    title="RightFixedNote"
    items={sampleItems}
    onSubmit={action('submit!')}
    onClickEdit={action('click edit!!')}
    textareaLabel="コメント"
  />
)
All.storyName = 'all'

export const WithoutTextareaLabel: Story = () => (
  <RightFixedNote
    title="RightFixedNote"
    items={sampleItems}
    onSubmit={action('submit!')}
    onClickEdit={action('click edit!!')}
  />
)
WithoutTextareaLabel.storyName = 'without textarea label'

export const WithoutItems: Story = () => (
  <RightFixedNote
    title="RightFixedNote"
    onSubmit={action('submit!')}
    onClickEdit={action('click edit!!')}
    textareaLabel="コメント"
  />
)
WithoutItems.storyName = 'without items'

export const WithoutItemsAndTextareaLabel: Story = () => (
  <RightFixedNote
    title="RightFixedNote"
    onSubmit={action('submit!')}
    onClickEdit={action('click edit!!')}
  />
)
WithoutItemsAndTextareaLabel.storyName = 'without items and textarea label'
