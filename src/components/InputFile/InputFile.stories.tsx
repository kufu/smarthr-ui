import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'

import { InputFile } from './InputFile'

export default {
  title: 'InputFile',
  component: InputFile,
}

export const All: Story = () => {
  return (
    <List>
      <dt>Default</dt>
      <dd>
        <InputFile label="Choose File" onChange={action('onChange')} multiple />
      </dd>
      <dt>Size S</dt>
      <dd>
        <InputFile label="Choose File" onChange={action('onChange')} size="s" multiple />
      </dd>
      <dt>Disabled file list</dt>
      <dd>
        <InputFile label="Choose File" onChange={action('onChange')} hasFileList={false} />
      </dd>
      <dt>Disabled input</dt>
      <dd>
        <InputFile label="Choose File" disabled />
      </dd>
      <dt>エラー</dt>
      <dd>
        <InputFile label="Choose File" error />
      </dd>
    </List>
  )
}
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
