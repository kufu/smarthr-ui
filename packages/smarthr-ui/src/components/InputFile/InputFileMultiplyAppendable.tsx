'use client'

import {
  type ChangeEvent,
  type MouseEvent,
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useLatest } from '../../hooks/useLatest'
import { Stack } from '../Layout'
import { Groupbox } from '../Panel'

import { FilePreviewDialog } from './FilePreviewDialog'
import { FileListItem, LabelRender, StyledFaFolderOpenIcon } from './parts'
import { classNameGenerator } from './style'

import type { LowerProps } from './types'

const BASE_COLUMN_PADDING = { block: 0.5, inline: 1 } as const

export const InputFileMultiplyAppendable = forwardRef<
  HTMLInputElement,
  Omit<LowerProps, 'multiple'>
>(
  (
    { className, size, label, hasFileList = true, previewable, onChange, disabled, error, ...rest },
    ref,
  ) => {
    const [files, setFiles] = useState<File[]>([])
    const [previewFile, setPreviewFile] = useState<File | null>(null)
    const labelId = useId()

    const classNames = useMemo(() => {
      const { wrapper, fileList, fileItem, inputWrapper, input, prefix } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        inputWrapper: inputWrapper({ size }),
        fileList: fileList(),
        fileItem: fileItem(),
        input: input(),
        prefix: prefix(),
      }
    }, [size, className])

    // Safari において、input.files への直接代入時に onChange が発火することを防ぐためのフラグ
    const isUpdatingFilesRef = useRef(false)

    const latest = useLatest({ onChange, files, previewFile })

    const functions = useMemo(() => {
      const updateFiles = (input: HTMLInputElement, newFiles: File[]) => {
        latest.onChange?.(newFiles)

        const buff = new DataTransfer()
        newFiles.forEach((file) => {
          buff.items.add(file)
        })

        isUpdatingFilesRef.current = true
        input.files = buff.files
        isUpdatingFilesRef.current = false

        setFiles(newFiles)
      }

      return {
        handleChange: (e: ChangeEvent<HTMLInputElement>) => {
          // Safari において、input.files への直接代入時はonChangeを発火させない
          if (isUpdatingFilesRef.current) {
            return
          }

          const newFiles = Array.from(e.target.files ?? [])

          updateFiles(e.target, [...latest.files, ...newFiles])
        },
        handleDelete: (e: MouseEvent<HTMLButtonElement>) => {
          const input = e.currentTarget
            .closest('.smarthr-ui-InputFile')
            ?.querySelector<HTMLInputElement>('[data-smarthr-ui-input="true"][type="file"]')

          if (!input) {
            return
          }

          const index = parseInt(e.currentTarget.value, 10)
          const newFiles = latest.files.filter((_, i) => index !== i)

          // 削除後、同一ファイルを再選択可能にするためinput.valueをリセット
          input.value = ''

          updateFiles(input, newFiles)
        },
        handleClosePreview: () => {
          setPreviewFile(null)
        },
        handleDownload: () => {
          const file = latest.previewFile
          if (!file) return

          const url = URL.createObjectURL(file)
          const a = document.createElement('a')
          a.href = url
          a.download = file.name
          a.click()
          URL.revokeObjectURL(url)
        },
      }
    }, [latest])

    return (
      <Stack align="flex-start" className={classNames.wrapper}>
        {hasFileList && !disabled && files.length > 0 && (
          <Groupbox as="ul" padding={BASE_COLUMN_PADDING} className={classNames.fileList}>
            {files.map((file, index) => (
              <FileListItem
                key={index}
                file={file}
                index={index}
                previewable={!!previewable}
                className={classNames.fileItem}
                handleDeleteClick={functions.handleDelete}
                handlePreviewClick={setPreviewFile}
              />
            ))}
          </Groupbox>
        )}
        <span className={classNames.inputWrapper}>
          <input
            {...rest}
            ref={ref}
            type="file"
            disabled={disabled}
            multiple
            className={classNames.input}
            aria-invalid={error || undefined}
            aria-labelledby={labelId}
            data-smarthr-ui-input="true"
            onChange={functions.handleChange}
          />
          <StyledFaFolderOpenIcon className={classNames.prefix} />
          <LabelRender id={labelId} label={label} />
        </span>
        {previewable && (
          <FilePreviewDialog
            file={previewFile}
            searchable={previewable?.searchable}
            handleClose={functions.handleClosePreview}
            handleDownload={functions.handleDownload}
          />
        )}
      </Stack>
    )
  },
)
