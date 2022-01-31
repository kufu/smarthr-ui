import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InputFile } from './InputFile'

import readme from './README.md'

storiesOf('InputFile', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const [files1, setFiles1] = React.useState<File[]>([])
    const [files2, setFiles2] = React.useState<File[]>([])
    const [files3, setFiles3] = React.useState<File[]>([])

    return (
      <List>
        <dt>Default</dt>
        <dd>
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
        </dd>
        <dt>Size S</dt>
        <dd>
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
        </dd>
        <dt>Disabled file list</dt>
        <dd>
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
        </dd>
        <dt>Disabled input</dt>
        <dd>
          <InputFile label="Choose File" files={[]} disabled />
        </dd>
        <dt>エラー</dt>
        <dd>
          <InputFile label="Choose File" files={[]} error />
        </dd>
      </List>
    )
  })

const List = styled.dl`
  margin: 1rem;

  & > dt {
    margin-bottom: 0.5rem;
  }

  & > dd {
    margin: 0 0 1rem;
  }
`
