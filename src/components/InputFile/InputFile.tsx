import React, { FC, useState, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { TextButton } from '../Button'
import { Icon } from '../Icon'

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  id?: string
  className?: string
}

export const InputFile: FC<Props> = ({ label, id, className }) => {
  const [files, setFiles] = useState<File[]>([])

  const removeFile = (index: number) => {
    const newFiles = [...files] // stateをコピーする

    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  return (
    <Wrapper className={className}>
      <DownloadList>
        <ul>
          {files?.map((file, index) => {
            return (
              <li key={index}>
                <span>{file.name}</span>
                <span>
                  <TextButton
                    suffix={<Icon size={14} name="fa-plus-circle" />}
                    onClick={() => removeFile(index)}
                  >
                    Button
                  </TextButton>
                </span>
              </li>
            )
          })}
        </ul>
      </DownloadList>
      <DownloadButton>
        <Icon size={14} name="fa-folder-open" />
        <label htmlFor={id}>
          <span>{label}</span>
        </label>
        <input
          type="file"
          id={id}
          multiple
          onChange={(e) => {
            if (e.target.files) {
              const uploadFiles = Array.from(e.target.files)
              setFiles(uploadFiles)
            }
            console.log(e.target.files)
          }}
        />
      </DownloadButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: block;

  input {
    visually: hidden;
  }
`

const DownloadList = styled.div`
  display: block;
`

const DownloadButton = styled.div`
  display: block;
`
