'use client'

import React, {
  ComponentPropsWithRef,
  ReactNode,
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { VariantProps } from 'tailwind-variants'

import { BaseColumn } from '../Base'
import { Button } from '../Button'
import { FaFolderOpenIcon, FaTrashCanIcon } from '../Icon'
import { Stack } from '../Layout'

import { inputFile } from './style'

import type { DecoratorsType } from '../../types'

export type Props = VariantProps<typeof inputFile> & {
  /** フォームのラベル */
  label: ReactNode
  /** ファイルの選択に変更があったときに発火するコールバック関数 */
  onChange?: (files: File[]) => void
  /** ファイルリストを表示するかどうか */
  hasFileList?: boolean
  /** コンポーネント内のテキストを変更する関数 */
  decorators?: DecoratorsType<'destroy'>
  error?: boolean
}
type ElementProps = Omit<ComponentPropsWithRef<'input'>, keyof Props | 'multiple'>

const DESTROY_BUTTON_TEXT = '削除'
const BASE_COLUMN_PADDING = { block: 0.5, inline: 1 } as const

export const InputFileSingle = forwardRef<HTMLInputElement, Props & ElementProps>(
  (
    {
      className,
      size,
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
    const [files, setFiles] = useState<File[]>([])
    const labelId = useId()

    const {
      wrapperStyle,
      inputWrapperStyle,
      fileListStyle,
      fileItemStyle,
      inputStyle,
      prefixStyle,
    } = useMemo(() => {
      const { wrapper, fileList, fileItem, inputWrapper, input, prefix } = inputFile()

      return {
        wrapperStyle: wrapper({ className }),
        inputWrapperStyle: inputWrapper({ size, disabled }),
        fileListStyle: fileList(),
        fileItemStyle: fileItem(),
        inputStyle: input(),
        prefixStyle: prefix(),
      }
    }, [disabled, size, className])

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

    const updateFiles = useCallback(
      (newFiles: File[]) => {
        if (onChange) {
          onChange(newFiles)
        }

        setFiles(newFiles)
      },
      [setFiles, onChange],
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isUpdatingFilesDirectly.current) {
          return
        }

        updateFiles(Array.from(e.target.files ?? []))
      },
      [isUpdatingFilesDirectly, updateFiles],
    )

    const handleDelete = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!inputRef.current) {
          return
        }

        const index = parseInt(e.currentTarget.value, 10)
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
      <Stack align="flex-start" className={wrapperStyle}>
        {!disabled && hasFileList && files.length > 0 && (
          <BaseColumn as="ul" padding={BASE_COLUMN_PADDING} className={fileListStyle}>
            {files.map((file, index) => (
              <li key={index} className={fileItemStyle}>
                <span className="smarthr-ui-InputFile-fileName">{file.name}</span>
                <Button
                  variant="text"
                  prefix={<FaTrashCanIcon />}
                  value={index}
                  onClick={handleDelete}
                  className="smarthr-ui-InputFile-deleteButton"
                >
                  {destroyButtonText}
                </Button>
              </li>
            ))}
          </BaseColumn>
        )}
        <span className={inputWrapperStyle}>
          {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
          <input
            {...props}
            data-smarthr-ui-input="true"
            type="file"
            onChange={handleChange}
            disabled={disabled}
            className={inputStyle}
            ref={inputRef}
            aria-invalid={error || undefined}
            aria-labelledby={labelId}
          />
          <StyledFaFolderOpenIcon className={prefixStyle} />
          <LabelRender id={labelId} label={label} />
        </span>
      </Stack>
    )
  },
)

const StyledFaFolderOpenIcon = React.memo<{ className: string }>(({ className }) => (
  <span className={className}>
    <FaFolderOpenIcon />
  </span>
))

const LabelRender = React.memo<{ id: string; label: ReactNode }>(({ id, label }) => (
  <span id={id} aria-hidden="true">
    {label}
  </span>
))
