import React, {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'
import { FaFolderOpenIcon, FaTrashAltIcon } from '../Icon'

import { useClassNames } from './useClassNames'

import type { DecoratorsType } from '../../types'

type Size = 'default' | 's'

export type Props = {
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** コンポーネントの大きさ */
  size?: Size
  /** フォームのラベル */
  label: ReactNode
  /** ファイルの選択に変更があったときに発火するコールバック関数 */
  onChange?: (files: File[]) => void
  /** `true` の時、フォームの枠の色が `DANGER` になる */
  error?: boolean
  /** ファイルリストを表示するかどうか */
  hasFileList?: boolean
  /** コンポーネント内のテキストを変更する関数 */
  decorators?: DecoratorsType<'destroy'>
}
type ElementProps = Omit<InputHTMLAttributes<HTMLInputElement>, keyof Props>

const DESTROY_BUTTON_TEXT = '削除'

export const InputFile = forwardRef<HTMLInputElement, Props & ElementProps>(
  (
    {
      className = '',
      size = 'default',
      label,
      hasFileList = true,
      onChange,
      disabled = false,
      error,
      decorators,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme()
    const [files, setFiles] = useState<File[]>([])

    // Safari において、input.files への直接代入時に onChange が発火することを防ぐためのフラグ
    const isUpdatingFilesDirectly = useRef(false)

    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current,
    )

    const destroyButtonText = useMemo(
      () => decorators?.destroy?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT,
      [decorators],
    )
    const inputWrapperClassName = useMemo(
      () => `${size === 's' ? 'small' : ''} ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`,
      [disabled, error, size],
    )

    const classNames = useClassNames()

    const updateFiles = useCallback(
      (newFiles: File[]) => {
        onChange && onChange(newFiles)
        setFiles(newFiles)
      },
      [setFiles, onChange],
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isUpdatingFilesDirectly.current) {
          return
        }
        const newFiles = Array.from(e.target.files ?? [])
        updateFiles(newFiles)
      },
      [isUpdatingFilesDirectly, updateFiles],
    )

    const handleDelete = useCallback(
      (index: number) => {
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
      },
      [files, isUpdatingFilesDirectly, inputRef, updateFiles],
    )

    return (
      <Wrapper className={`${className} ${classNames.wrapper}`}>
        {!disabled && hasFileList && files.length > 0 && (
          <FileList themes={theme} className={classNames.fileList}>
            {files.map((file, index) => (
                <li key={`${file.name}-${index}`}>
                  <span className={classNames.fileName}>{file.name}</span>
                  <span>
                    <Button
                      variant="text"
                      prefix={<FaTrashAltIcon />}
                      onClick={() => handleDelete(index)}
                      className={classNames.deleteButton}
                    >
                      {destroyButtonText}
                    </Button>
                  </span>
                </li>
              ))}
          </FileList>
        )}
        <InputWrapper className={inputWrapperClassName} themes={theme}>
          {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
          <input
            {...props}
            type="file"
            onChange={handleChange}
            disabled={disabled}
            className={classNames.input}
            ref={inputRef}
            aria-invalid={error || undefined}
          />
          <Prefix themes={theme}>
            <FaFolderOpenIcon />
          </Prefix>
          {label}
        </InputWrapper>
      </Wrapper>
    )
  },
)

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
    background-color: ${color.WHITE};
    position: relative;
    display: inline-flex;
    font-weight: bold;
    line-height: ${leading.NONE};
    border: ${border.shorthand};
    border-radius: ${radius.m};
    padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
    font-size: ${fontSize.M};

    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

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
  ${({ themes: { spacingByChar } }) => css`
      display: inline-flex;
      margin-right: ${spacingByChar(0.5)};
    `}
`
