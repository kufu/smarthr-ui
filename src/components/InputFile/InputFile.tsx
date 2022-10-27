import React, { InputHTMLAttributes, VFC, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button } from '../Button'
import { FaFolderOpenIcon, FaTrashAltIcon } from '../Icon'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Size = 'default' | 's'

export type Props = {
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** コンポーネントの大きさ */
  size?: Size
  /** フォームのラベル */
  label: string
  /** ファイルの選択に変更があったときに発火するコールバック関数 */
  onChange?: (files: File[]) => void
  /** `true` の時、フォームの枠の色が `DANGER` になる */
  error?: boolean
  /** ファイルリストを表示するかどうか */
  hasFileList?: boolean
}
type ElementProps = Omit<InputHTMLAttributes<HTMLInputElement>, keyof Props>

export const InputFile: VFC<Props & ElementProps> = ({
  className = '',
  size = 'default',
  label,
  hasFileList = true,
  onChange,
  disabled = false,
  error,
  ...props
}) => {
  const theme = useTheme()
  const [files, setFiles] = useState<File[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const labelDisabledClassName = disabled ? 'disabled' : ''
  const labelSmallClassName = size === 's' ? 'small' : ''
  const labelFocusedClassName = isFocused ? 'focus' : ''
  const errorClassName = error ? 'error' : ''
  // Safari において、input.files への直接代入時に onChange が発火することを防ぐためのフラグ
  const isUpdatingFilesDirectly = useRef(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const updateFiles = (newFiles: File[]) => {
    onChange && onChange(newFiles)
    setFiles(newFiles)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdatingFilesDirectly.current) {
      return
    }
    const newFiles = Array.from(e.target.files ?? [])
    updateFiles(newFiles)
  }

  const handleDelete = (index: number) => {
    if (!inputRef.current) {
      return
    }
    const newFiles = files.filter((_, i) => index !== i)
    updateFiles(newFiles)

    const buff = new DataTransfer()
    newFiles.forEach((file) => {
      buff.items.add(file)
    })
    isUpdatingFilesDirectly.current = true
    inputRef.current.files = buff.files
    isUpdatingFilesDirectly.current = false
  }

  const classNames = useClassNames()

  return (
    <Wrapper className={`${className} ${classNames.wrapper}`}>
      {!disabled && hasFileList && files.length > 0 && (
        <FileList themes={theme} className={classNames.fileList}>
          {files.map((file, index) => {
            return (
              <li key={`${file.name}-${index}`}>
                <span className={classNames.fileName}>{file.name}</span>
                <span>
                  <Button
                    variant="text"
                    prefix={<FaTrashAltIcon />}
                    onClick={() => handleDelete(index)}
                    className={classNames.deleteButton}
                  >
                    削除
                  </Button>
                </span>
              </li>
            )
          })}
        </FileList>
      )}
      <InputWrapper
        className={`${labelSmallClassName} ${labelDisabledClassName} ${labelFocusedClassName} ${errorClassName}`}
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
          aria-invalid={error || undefined}
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
    margin-top: 0;
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
    &:focus-within {
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
    &&.error {
      border-color: ${color.DANGER};
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
