import React, { FC, InputHTMLAttributes, useState } from 'react'
import styled, { css } from 'styled-components'
import { TextButton } from '../Button'
import { Icon } from '../Icon'
import { Theme, useTheme } from '../../hooks/useTheme'

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  id?: string
  className?: string
  label: string
  files?: File[]
  multiple?: boolean
}

export const InputFile: FC<Props> = ({ label, id, className, files, multiple = true }) => {
  const [filesArray, setFilesArray] = useState<File[]>(files ? files : [])
  const theme = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadFile = Array.from(e.target.files)
      setFilesArray([...filesArray, ...uploadFile])
    }
  }

  const handleRemove = (index: number) => {
    const newFilesArray = [...filesArray]
    newFilesArray.splice(index, 1)
    setFilesArray(newFilesArray)
  }

  return (
    <Wrapper className={className}>
      {filesArray.length > 0 && (
        <FileList themes={theme}>
          {filesArray.map((file, index) => {
            return (
              <li key={index}>
                <span>{file.name}</span>
                <span>
                  <TextButton
                    prefix={<Icon size={14} name="fa-trash-alt" />}
                    onClick={() => handleRemove(index)}
                  >
                    削除
                  </TextButton>
                </span>
              </li>
            )
          })}
        </FileList>
      )}
      <UploadButtonWrapper>
        <UploadButton themes={theme}>
          <label htmlFor={id}>
            <Prefix themes={theme}>
              <Icon size={14} name="fa-folder-open" />
            </Prefix>
            {label}
          </label>
        </UploadButton>
        <input type="file" id={id} onChange={(e) => handleChange(e)} multiple={multiple} />
      </UploadButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: block;
`

const FileList = styled.ul<{ themes: Theme }>(({ themes }) => {
  const { frame, palette, size } = themes
  return css`
    font-size: ${size.pxToRem(size.font.TALL)};
    border-radius: ${frame.border.radius.m};
    padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
    margin-bottom: ${size.pxToRem(size.space.XS)};
    background-color: ${palette.BACKGROUND};
    list-style: none;

    > li {
      display: flex;
      align-items: center;
    }
  `
})

const UploadButtonWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;

  > input[type='file'] {
    position: absolute;
    cursor: pointer;
    height: 100%;
    left: 0;
    top: 0;
    margin: 0;
    font-size: 128px;
    opacity: 0;

    &::-webkit-file-upload-button {
      cursor: pointer;
    }
  }
`

const UploadButton = styled.button<{ themes: Theme }>(({ themes }) => {
  const { frame, palette, size } = themes
  return css`
    font-family: inherit;
    font-weight: bold;
    font-size: ${size.pxToRem(size.font.TALL)};
    height: 40px;
    padding: 0 ${size.pxToRem(size.space.XS)};
    border-radius: ${frame.border.radius.m};
    color: ${palette.TEXT_BLACK};
    background-color: #fff;
    border: ${frame.border.default};

    > label {
      display: flex;
      align-items: center;
    }

    &.prefix {
      justify-content: left;
    }
  `
})

const Prefix = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size
    return css`
      display: inline-flex;
      margin-right: ${pxToRem(space.XXS)};
    `
  }}
`
