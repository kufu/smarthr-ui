import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InputFile } from './InputFile'

storiesOf('InputFile', module).add('all', () => {
  const files: File[] = [
    { name: 'fileName' } as File,
    {
      name:
        'はばぱひびぴふぶぷへべぺほぼぽ_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.txt',
    } as File,
  ]
  return (
    <>
      <Wrapper>
        <p>Default</p>
        <InputFile label="ファイルを選択" onChange={action('change')} />
      </Wrapper>
      <Wrapper>
        <p>Set 'file'</p>
        <InputFile label="ファイルを選択" onChange={action('change')} file={files} />
      </Wrapper>
    </>
  )
})

const Wrapper = styled.div`
  margin: 1rem;

  > * {
    margin-right: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
  }
`
