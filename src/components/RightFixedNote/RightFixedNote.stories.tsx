import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import * as React from 'react'

import { RightFixedNote } from './RightFixedNote'
import { ItemProps } from './RightFixedNoteItem'

export default {
  title: 'Data Display（データ表示）/RightFixedNote',
  component: RightFixedNote,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: '500px',
      },
    },
  },
}

const sampleItems: ItemProps[] = [
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
    text: '編集できないコメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
    editable: false,
  },
]

export const All: StoryFn = () => (
  <RightFixedNote
    title="RightFixedNote"
    items={sampleItems}
    onSubmit={action('submit!')}
    onClickEdit={action('click edit!!')}
    textareaLabel="コメント"
  />
)
All.storyName = 'all'

export const WithoutTextareaLabel: StoryFn = () => (
  <RightFixedNote
    title="RightFixedNote"
    items={sampleItems}
    onSubmit={action('submit!')}
    onClickEdit={action('click edit!!')}
  />
)
WithoutTextareaLabel.storyName = 'without textarea label'

export const WithoutItems: StoryFn = () => (
  <RightFixedNote
    title="RightFixedNote"
    onSubmit={action('submit!')}
    onClickEdit={action('click edit!!')}
    textareaLabel="コメント"
  />
)
WithoutItems.storyName = 'without items'

export const WithoutItemsAndTextareaLabel: StoryFn = () => (
  <RightFixedNote
    title="RightFixedNote"
    onSubmit={action('submit!')}
    onClickEdit={action('click edit!!')}
  />
)
WithoutItemsAndTextareaLabel.storyName = 'without items and textarea label'
