import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components'

import { InputFile } from './InputFile'

storiesOf('InputFile', module).add('all', () => {
  const [defaultFiles, setDefaultFiles] = useState<File[]>([])
  const [fileListFiles, setFileListFiles] = useState<File[]>([])

  return (
    <>
      <Wrapper>
        <p>Default</p>
        <InputFile
          label="ファイルを選択"
          onAdd={(addFiles) => {
            setDefaultFiles([...defaultFiles, ...addFiles])
          }}
          onDelete={(index) => {
            const newFiles = [...defaultFiles]
            newFiles.splice(index, 1)
            setDefaultFiles(newFiles)
          }}
          files={defaultFiles}
          multiple
        />
      </Wrapper>
      <Wrapper>
        <p>Disabled file list</p>
        <InputFile
          label="ファイルを選択"
          onAdd={(addFiles) => {
            setFileListFiles([...fileListFiles, ...addFiles])
          }}
          onDelete={(index) => {
            const newFiles = [...fileListFiles]
            newFiles.splice(index, 1)
            setFileListFiles(newFiles)
          }}
          files={fileListFiles}
          hasFileList={false}
        />
      </Wrapper>
      <Wrapper>
        <p>Disabled input</p>
        <InputFile label="ファイルを選択" files={[]} disabled />
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
