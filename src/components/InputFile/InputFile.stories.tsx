import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { FormControl } from '../FormControl'

import { InputFile } from './InputFile'

export default {
  title: 'Forms（フォーム）/InputFile',
  component: InputFile,
}

export const All: StoryFn = () => (
  <>
    <StyledFormControl title="Default">
      <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
    </StyledFormControl>
    <StyledFormControl title="Size S">
      <InputFile
        name="size"
        label="ファイルを選択"
        onChange={action('onChange')}
        size="s"
        multiple
      />
    </StyledFormControl>
    <StyledFormControl title="Disabled file list">
      <InputFile
        name="hasFileList"
        label="ファイルを選択"
        onChange={action('onChange')}
        hasFileList={false}
      />
    </StyledFormControl>
    <StyledFormControl title="Disabled input">
      <InputFile name="disabled" label="ファイルを選択" disabled />
    </StyledFormControl>
    <StyledFormControl title="エラー">
      <InputFile name="error" label="ファイルを選択" error />
    </StyledFormControl>
    <StyledFormControl title="decoratorで文言変更">
      <InputFile
        name="decorator"
        label="select file."
        decorators={{ destroy: (text) => `delete(${text})` }}
      />
    </StyledFormControl>
  </>
)
All.storyName = 'all'

const StyledFormControl = styled(FormControl)`
  margin: 0 0 1rem;
`
