'use client'

import React, {
  ComponentPropsWithRef,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
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
  files?: readonly File[]
  /** ファイルの選択に変更があったときに発火するコールバック関数 */
  onChange?: (files: File[]) => void
  /** ファイルリストを表示するかどうか */
  hasFileList?: boolean
  /** コンポーネント内のテキストを変更する関数 */
  decorators?: DecoratorsType<'destroy'>
  error?: boolean
}
type ElementProps = Omit<ComponentPropsWithRef<'input'>, keyof Props>

const DESTROY_BUTTON_TEXT = '削除'

export const InputFileMultiple = forwardRef<HTMLInputElement, Props & ElementProps>(
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

    const { wrapper, fileList, fileItem, inputWrapper, input, prefix } = inputFile()
    const wrapperStyle = useMemo(() => wrapper({ className }), [className, wrapper])
    const inputWrapperStyle = useMemo(
      () => inputWrapper({ size, disabled }),
      [disabled, inputWrapper, size],
    )

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

    useEffect(() => {
      if (!inputRef.current) {
        return
      }
      const buff = new DataTransfer()
      files.forEach((file) => {
        buff.items.add(file)
      })

      isUpdatingFilesDirectly.current = true
      inputRef.current.files = buff.files
      isUpdatingFilesDirectly.current = false
    }, [files])

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
        const newFiles = Array.from(e.target.files ?? [])
        updateFiles([...files, ...newFiles])
      },
      [files, isUpdatingFilesDirectly, updateFiles],
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
      <Stack align="flex-start" className={wrapperStyle}>
        {!disabled && hasFileList && files.length > 0 && (
          <BaseColumn as="ul" padding={{ block: 0.5, inline: 1 }} className={fileList()}>
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className={fileItem()}>
                <span className="smarthr-ui-InputFile-fileName">{file.name}</span>
                <Button
                  variant="text"
                  prefix={<FaTrashCanIcon />}
                  onClick={() => handleDelete(index)}
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
            multiple
            data-smarthr-ui-input="true"
            type="file"
            onChange={handleChange}
            disabled={disabled}
            className={input()}
            ref={inputRef}
            aria-invalid={error || undefined}
            aria-labelledby={labelId}
          />
          <span className={prefix()}>
            <FaFolderOpenIcon />
          </span>
          <span id={labelId} aria-hidden="true">
            {label}
          </span>
        </span>
      </Stack>
    )
  },
)
