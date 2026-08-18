'use client'

import {
  type ChangeEvent,
  type MouseEvent,
  forwardRef,
  useId,
  useImperativeHandle,
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

    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current,
      [],
    )

    const latest = useLatest({ onChange, files, previewFile })

    const functions = useMemo(() => {
      const updateFiles = (newFiles: File[]) => {
        if (!inputRef.current) {
          return
        }

        latest.onChange?.(newFiles)

        const buff = new DataTransfer()
        newFiles.forEach((file) => {
          buff.items.add(file)
        })

        isUpdatingFilesRef.current = true
        inputRef.current.files = buff.files
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

          updateFiles([...latest.files, ...newFiles])
        },
        handleDelete: (e: MouseEvent<HTMLButtonElement>) => {
          if (!inputRef.current) {
            return
          }

          const index = parseInt(e.currentTarget.value, 10)
          const newFiles = latest.files.filter((_, i) => index !== i)

          // 削除後、同一ファイルを再選択可能にするためinput.valueをリセット
          inputRef.current.value = ''

          updateFiles(newFiles)
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
                handleDeleteClick={functions.handleDelete}
                handlePreviewClick={setPreviewFile}
                className={classNames.fileItem}
              />
            ))}
          </Groupbox>
        )}
        <span className={classNames.inputWrapper}>
          <input
            {...rest}
            multiple
            data-smarthr-ui-input="true"
            type="file"
            onChange={functions.handleChange}
            disabled={disabled}
            ref={inputRef}
            aria-invalid={error || undefined}
            aria-labelledby={labelId}
            className={classNames.input}
          />
          <StyledFaFolderOpenIcon className={classNames.prefix} />
          <LabelRender id={labelId} label={label} />
        </span>
        {previewable && (
          <FilePreviewDialog
            file={previewFile}
            handleClose={functions.handleClosePreview}
            handleDownload={functions.handleDownload}
            searchable={previewable?.searchable}
          />
        )}
      </Stack>
    )
  },
)
