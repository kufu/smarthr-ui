import { StoryFn } from '@storybook/react'
import React from 'react'

import { NewText, Text } from './Text'

export default {
  title: 'Text（テキスト）/Text',
  component: Text,
}

export const Default: StoryFn = () => (
  <>
    <NewText as="h1" size="XXL" leading="TIGHT">
      &lt;Text&gt;
    </NewText>
    <NewText as="p">
      デフォルトの出力要素は <code>span</code> です。
    </NewText>
    <NewText as="p">
      styled-components と同じく <code>as</code> で要素を差し替えられます。
    </NewText>
    <NewText as="p">
      <NewText color="TEXT_GREY">色</NewText>や<NewText bold>ウェイト</NewText>、
      <NewText whiteSpace="nowrap">ホワイトスペース</NewText>を変えられます。
    </NewText>
    <NewText as="p">
      <code>emphasis</code> を渡すとそのテキストは<NewText emphasis>強調</NewText>を示し、
      <code>em</code>
      要素の太字装飾で出力します。
    </NewText>
    <NewText as="p">
      <NewText emphasis>入れ子</NewText>もできますが、
      <NewText color="TEXT_LINK" bold>
        Valid
      </NewText>
      な HTML になるよう注意してください。
    </NewText>
  </>
)
