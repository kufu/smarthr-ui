'use client'

import { type ChangeEvent, type FC, useId, useMemo, useRef, useState } from 'react'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'
import { Stack } from '../../Layout'
import { Groupbox } from '../../Panel'

import { FilePreviewDialog } from './FilePreviewDialog'
import { FileListItem, LabelRender, StyledFaFolderOpenIcon } from './parts'
import { classNameGenerator } from './style'

import type { ExistingFile, LowerProps } from '../types'

const BASE_COLUMN_PADDING = { block: 0.5, inline: 1 } as const

type Props = Omit<LowerProps, 'multiple'>

export const InputFileMultiplyAppendable: FC<Props> = ({
  className,
  size,
  label,
  hasFileList = true,
  previewable,
  onChange,
  disabled,
  error,
  defaultExistingFiles,
  onDeleteExistingFile,
  ref,
  ...rest
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>(
    () => defaultExistingFiles ?? [],
  )
  const [previewFile, setPreviewFile] = useState<File | ExistingFile | null>(null)
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

  const latest = useLatest({ onChange, files, existingFiles, onDeleteExistingFile, previewFile })

  const functions = useMemo(() => {
    let input: HTMLInputElement | null = null

    const updateFiles = (inputElement: HTMLInputElement, newFiles: File[]) => {
      latest.onChange?.(newFiles)

      const buff = new DataTransfer()
      newFiles.forEach((file) => {
        buff.items.add(file)
      })

      isUpdatingFilesRef.current = true
      inputElement.files = buff.files
      isUpdatingFilesRef.current = false

      setFiles(newFiles)
    }

    return {
      callbackRef: (node: HTMLInputElement | null) => {
        input = node
      },
      handleChange: (e: ChangeEvent<HTMLInputElement>) => {
        // Safari において、input.files への直接代入時はonChangeを発火させない
        if (isUpdatingFilesRef.current) {
          return
        }

        const newFiles = Array.from(e.target.files ?? [])

        updateFiles(e.target, [...latest.files, ...newFiles])
      },
      handleDelete: (file: File | ExistingFile, index: number) => {
        if (!(file instanceof File)) {
          const newExistingFiles = latest.existingFiles.filter((_, i) => index !== i)

          setExistingFiles(newExistingFiles)
          latest.onDeleteExistingFile?.(file, index)

          return
        }

        if (!input) {
          return
        }

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

        if (!(file instanceof File)) {
          const a = document.createElement('a')
          a.href = file.url
          a.download = file.name
          a.click()
          return
        }

        const url = URL.createObjectURL(file)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
      },
    }
  }, [latest])

  const mergedRef = useMergeRefs(functions.callbackRef, ref)

  const errorAttr = error || undefined

  return (
    <Stack align="flex-start" className={classNames.wrapper}>
      {hasFileList && !disabled && (existingFiles.length > 0 || files.length > 0) && (
        <Groupbox as="ul" padding={BASE_COLUMN_PADDING} className={classNames.fileList}>
          {existingFiles.map((file, index) => (
            <FileListItem
              key={`existing-${index}`}
              file={file}
              index={index}
              previewable={!!previewable}
              className={classNames.fileItem}
              handleDeleteClick={functions.handleDelete}
              handlePreviewClick={setPreviewFile}
            />
          ))}
          {files.map((file, index) => (
            <FileListItem
              key={`new-${index}`}
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
          ref={mergedRef}
          type="file"
          disabled={disabled}
          multiple
          className={classNames.input}
          aria-invalid={errorAttr}
          aria-labelledby={labelId}
          data-smarthr-ui-input-error={errorAttr}
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
}
