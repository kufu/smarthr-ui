import React, { InputHTMLAttributes, VFC, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { TextButton } from '../Button'
import { FaFolderOpenIcon, FaTrashAltIcon } from '../Icon'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Size = 'default' | 's'

export type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  id?: string
  className?: string
  size?: Size
  label: string
  files?: File[]
  onAdd?: (addFiles: File[]) => void
  onDelete?: (index: number) => void
  hasFileList?: boolean
}

export const InputFile: VFC<Props> = ({
  id,
  className = '',
  size = 'default',
  label,
  files = [],
  hasFileList = true,
  onAdd,
  onDelete,
  disabled = false,
  ...props
}) => {
  const theme = useTheme()
  const FileButtonWrapperClassName = `${disabled ? 'disabled' : ''}`
  const FileButtonClassName = `${size}`
  const isUpdatingFiles = React.useRef(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      const buff = new DataTransfer()
      files.forEach((file) => {
        buff.items.add(file)
      })

      isUpdatingFiles.current = true
      inputRef.current.files = buff.files
      isUpdatingFiles.current = false
    }
  }, [files])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!inputRef.current) {
      return
    }
    if (e.code === 'Enter' || e.code === 'Space') {
      inputRef.current.click()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUpdatingFiles.current && onAdd && e.target.files && e.target.files?.length > 0) {
      const uploadFile = Array.from(e.target.files)
      onAdd(uploadFile)
    }
  }

  const handleDelete = (index: number) => {
    onDelete && onDelete(index)
  }

  const classNames = useClassNames()

  return (
    <Wrapper className={`${className} ${classNames.wrapper}`}>
      {!disabled && hasFileList && files.length > 0 && (
        <FileList themes={theme} className={classNames.fileList}>
          {files.map((file, index) => {
            return (
              <li key={index}>
                <span className={classNames.fileName}>{file.name}</span>
                <span>
                  <TextButton
                    prefix={<FaTrashAltIcon />}
                    onClick={() => handleDelete(index)}
                    className={classNames.deleteButton}
                  >
                    削除
                  </TextButton>
                </span>
              </li>
            )
          })}
        </FileList>
      )}
      <FileButtonWrapper themes={theme} className={FileButtonWrapperClassName}>
        <input
          {...props}
          type="file"
          id={id}
          onChange={(e) => handleChange(e)}
          disabled={disabled}
          tabIndex={-1}
          className={classNames.input}
          ref={inputRef}
        />
        <FileButton
          themes={theme}
          className={`${FileButtonClassName} ${classNames.button}`}
          disabled={disabled}
          type="button"
          onKeyDown={(e) => handleKeyDown(e)}
        >
          <label htmlFor={id}>
            <Prefix themes={theme}>
              <FaFolderOpenIcon />
            </Prefix>
            {label}
          </label>
        </FileButton>
      </FileButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: block;
`

const FileList = styled.ul<{ themes: Theme }>(({ themes }) => {
  const { fontSize, color, spacingByChar } = themes
  return css`
    font-size: ${fontSize.M};
    padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
    margin-bottom: ${spacingByChar(1)};
    background-color: ${color.COLUMN};
    list-style: none;

    > li {
      display: flex;
      align-items: center;
    }
  `
})

const FileButtonWrapper = styled.div<{ themes: Theme }>(({ themes }) => {
  const { color, interaction } = themes

  return css`
    position: relative;
    overflow: hidden;
    display: inline-block;

    > input[type='file'] {
      position: absolute;
      height: 100%;

      left: 0;
      top: 0;
      margin: 0;

      /* HINT: input[type=file] が button ボタンを覆うようにサイズを調整
      デフォルト font-size に !important がついているプロダクトの場合、上書きされてしまうため念のため !important を入れる */
      font-size: 128px !important;
      opacity: 0;
      appearance: none;
      cursor: pointer;

      &::-webkit-file-upload-button {
        cursor: pointer;
      }
    }

    > button {
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
    }

    &:hover {
      > button {
        background-color: ${color.hoverColor(color.WHITE)};
      }
      &.disabled {
        > button {
          background-color: ${color.COLUMN};
        }
      }
    }

    &.disabled {
      > input[type='file'] {
        display: none;
      }
    }
  `
})

const FileButton = styled.button<{ themes: Theme }>(({ themes }) => {
  const { fontSize, border, radius, color, spacingByChar } = themes
  return css`
    font-family: inherit;
    font-weight: bold;
    border-radius: ${radius.m};
    color: ${color.TEXT_BLACK};
    background-color: ${color.WHITE};
    border: ${border.shorthand};

    > label {
      display: flex;
      align-items: center;
    }

    &.default {
      font-size: ${fontSize.M};
      height: 40px;
      padding: 0 ${spacingByChar(1)};
    }

    &.s {
      font-size: ${fontSize.S};
      height: 27px;
      padding: 0 ${spacingByChar(0.5)};
    }

    &.square {
      width: 40px;
      padding: 0;

      &.s {
        width: 27px;
        min-width: 27px;
      }
    }

    &.prefix {
      justify-content: left;
    }

    &[disabled] {
      cursor: not-allowed;
      background-color: ${color.COLUMN};
      color: ${color.TEXT_DISABLED};
      > label {
        cursor: not-allowed;
      }
    }
  `
})

const Prefix = styled.span<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      display: inline-flex;
      margin-right: ${spacingByChar(0.5)};
    `
  }}
`
