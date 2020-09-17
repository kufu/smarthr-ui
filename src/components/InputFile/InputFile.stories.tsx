import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InputFile } from './InputFile'

storiesOf('InputFile', module).add('all', () => {
  const [files1, setFiles1] = React.useState<File[]>([])
  const [files2, setFiles2] = React.useState<File[]>([])
  const [files3, setFiles3] = React.useState<File[]>([])

  return (
    <>
      <Wrapper>
        <p>Default</p>
        <InputFile
          label="Choose File"
          onAdd={(addFiles) => {
            setFiles1([...files1, ...addFiles])
          }}
          onDelete={(index) => {
            const newFiles = [...files1]
            newFiles.splice(index, 1)
            setFiles1(newFiles)
          }}
          files={files1}
          multiple
        />
      </Wrapper>
      <Wrapper>
        <p>Size S</p>
        <InputFile
          label="Choose File"
          onAdd={(addFiles) => {
            setFiles2([...files2, ...addFiles])
          }}
          onDelete={(index) => {
            const newFiles = [...files2]
            newFiles.splice(index, 1)
            setFiles2(newFiles)
          }}
          files={files2}
          size="s"
          multiple
        />
      </Wrapper>
      <Wrapper>
        <p>Disabled file list</p>
        <InputFile
          label="Choose File"
          onAdd={(addFiles) => {
            setFiles3([...files3, ...addFiles])
          }}
          onDelete={(index) => {
            const newFiles = [...files3]
            newFiles.splice(index, 1)
            setFiles3(newFiles)
          }}
          files={files3}
          hasFileList={false}
        />
      </Wrapper>
      <Wrapper>
        <p>Disabled input</p>
        <InputFile label="Choose File" files={[]} disabled />
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
