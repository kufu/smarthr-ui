import React, { InputHTMLAttributes, VFC, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { TextButton } from '../Button'
import { FaFolderOpenIcon, FaTrashAltIcon } from '../Icon'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Size = 'default' | 's'

export type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  className?: string
  size?: Size
  label: string
  files?: File[]
  onAdd?: (addFiles: File[]) => void
  onDelete?: (index: number) => void
  hasFileList?: boolean
}

export const InputFile: VFC<Props> = ({
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
  const [isFocused, setIsFocused] = useState(false)
  const labelDisabledClassName = disabled ? 'disabled' : ''
  const labelSmallClassName = size === 's' ? 'small' : ''
  const labelFocusedClassName = isFocused ? 'focus' : ''
  const isUpdatingFiles = useRef(false)

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
      <InputWrapper
        className={`${labelSmallClassName} ${labelDisabledClassName} ${labelFocusedClassName}`}
        themes={theme}
      >
        <input
          {...props}
          type="file"
          onChange={(e) => handleChange(e)}
          disabled={disabled}
          className={classNames.input}
          ref={inputRef}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Prefix themes={theme}>
          <FaFolderOpenIcon />
        </Prefix>
        {label}
      </InputWrapper>
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

const InputWrapper = styled.span<{ themes: Theme }>(({ themes }) => {
  const { border, color, fontSize, leading, radius, shadow, spacingByChar } = themes
  return css`
    position: relative;
    display: inline-flex;
    font-weight: bold;
    line-height: ${leading.NONE};
    border: ${border.shorthand};
    border-radius: ${radius.m};
    padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
    font-size: ${fontSize.M};

    &.small {
      padding: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
    }
    &.focus {
      ${shadow.focusIndicatorStyles}
    }
    &.disabled {
      border-color: ${color.disableColor(color.BORDER)};
      background-color: ${color.disableColor(color.WHITE)};
      color: ${color.TEXT_DISABLED};
    }
    &:not(.disabled) {
      &:hover {
        border-color: ${color.hoverColor(color.BORDER)};
        background-color: ${color.hoverColor(color.WHITE)};
        color: ${color.TEXT_BLACK};
      }
    }

    > input[type='file'] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      ::file-selector-button {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      &[disabled] {
        ::file-selector-button {
          cursor: not-allowed;
        }
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
