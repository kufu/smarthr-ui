import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React from 'react'

import { FormControl } from '../FormControl'
import { Stack } from '../Layout'

import { InputFile } from './InputFile'

export default {
  title: 'Forms（フォーム）/InputFile',
  component: InputFile,
}

export const All: StoryFn = () => (
  <Stack>
    <FormControl title="Default">
      <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
    </FormControl>
    <FormControl title="Size S">
      <InputFile
        name="size"
        label="ファイルを選択"
        onChange={action('onChange')}
        size="s"
        multiple
      />
    </FormControl>
    <FormControl title="Disabled file list">
      <InputFile
        name="hasFileList"
        label="ファイルを選択"
        onChange={action('onChange')}
        hasFileList={false}
      />
    </FormControl>
    <FormControl title="Disabled input">
      <InputFile name="disabled" label="ファイルを選択" disabled />
    </FormControl>
    <FormControl title="エラー" autoBindErrorInput={false}>
      <InputFile name="error" label="ファイルを選択" error />
    </FormControl>
    <FormControl title="エラー with FormControl" errorMessages={['エラーメッセージ']}>
      <InputFile name="error" label="ファイルを選択" />
    </FormControl>
    <FormControl title="decoratorで文言変更">
      <InputFile
        name="decorator"
        label="select file."
        decorators={{ destroy: (text) => `delete(${text})` }}
      />
    </FormControl>
  </Stack>
)
All.storyName = 'all'
