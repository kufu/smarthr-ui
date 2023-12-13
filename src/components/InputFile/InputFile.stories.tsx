import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InputFile } from './InputFile'

export default {
  title: 'Forms（フォーム）/InputFile',
  component: InputFile,
}

export const All: StoryFn = () => (
  <List>
    <dt>Default</dt>
    <dd>
      <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
    </dd>
    <dt>Size S</dt>
    <dd>
      <InputFile
        name="size"
        label="ファイルを選択"
        onChange={action('onChange')}
        size="s"
        multiple
      />
    </dd>
    <dt>Disabled file list</dt>
    <dd>
      <InputFile
        name="hasFileList"
        label="ファイルを選択"
        onChange={action('onChange')}
        hasFileList={false}
      />
    </dd>
    <dt>Disabled input</dt>
    <dd>
      <InputFile name="disabled" label="ファイルを選択" disabled />
    </dd>
    <dt>エラー</dt>
    <dd>
      <InputFile name="error" label="ファイルを選択" error />
    </dd>
    <dt>decoratorで文言変更</dt>
    <dd>
      <InputFile
        name="decorator"
        label="select file."
        decorators={{ destroy: (text) => `delete(${text})` }}
      />
    </dd>
  </List>
)
All.storyName = 'all'

const List = styled.dl`
  margin: 1rem;

  & > dt {
    margin-bottom: 0.5rem;
  }

  & > dd {
    margin: 0 0 1rem;
  }
`
