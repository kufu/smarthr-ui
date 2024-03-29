import { StoryFn } from '@storybook/react'
import React from 'react'

import { Stack } from '../Layout'

import { ResponseMessage } from './ResponseMessage'

export default {
  title: 'Text（テキスト）/ResponseMessage',
  component: ResponseMessage,
}

export const All: StoryFn = () => (
  <Stack>
    <ResponseMessage>情報を表すアイコンが付きます。デフォルトです。</ResponseMessage>
    <ResponseMessage type="success">成功を表すアイコンが付きます。</ResponseMessage>
    <ResponseMessage type="warning">警告を表すアイコンが付きます。</ResponseMessage>
    <ResponseMessage type="error">エラーを表すアイコンが付きます。</ResponseMessage>
    <ResponseMessage type="sync">
      同期を表すアイコンが付きます。InformationPanel のために存在し、基本的には使いません。
    </ResponseMessage>
  </Stack>
)
