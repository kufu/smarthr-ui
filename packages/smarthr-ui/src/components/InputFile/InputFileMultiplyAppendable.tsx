'use client'

import {
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
  forwardRef,
  memo,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useLatest } from '../../hooks/useLatest'
import { Localizer } from '../../intl'
import { BaseColumn } from '../Base'
import { Button } from '../Button'
import { FaFileArrowDownIcon, FaFileLinesIcon, FaFolderOpenIcon, FaTrashCanIcon } from '../Icon'
import { Stack } from '../Layout'

import { FilePreviewDialog } from './FilePreviewDialog'
import { classNameGenerator } from './style'
import { downloadFile, isImageOrPdf } from './utils'

import type { Props } from './types'

const BASE_COLUMN_PADDING = { block: 0.5, inline: 1 } as const

export const InputFileMultiplyAppendable = forwardRef<HTMLInputElement, Omit<Props, 'multiple'>>(
  (
    { className, size, label, hasFileList = true, onChange, disabled = false, error, ...rest },
    ref,
  ) => {
    const [files, setFiles] = useState<File[]>([])
    const [previewFile, setPreviewFile] = useState<File | null>(null)
    const labelId = useId()

    const classNames = useMemo(() => {
      const { wrapper, fileList, fileItem, inputWrapper, input, prefix } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        inputWrapper: inputWrapper({ size, disabled }),
        fileList: fileList(),
        fileItem: fileItem(),
        input: input(),
        prefix: prefix(),
      }
    }, [disabled, size, className])

    // Safari において、input.files への直接代入時に onChange が発火することを防ぐためのフラグ
    const isUpdatingFilesRef = useRef(false)

    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current,
    )

    const latest = useLatest({ onChange, files })

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
      }
    }, [latest])

    return (
      <Stack align="flex-start" className={classNames.wrapper}>
        {!disabled && hasFileList && files.length > 0 && (
          <BaseColumn as="ul" padding={BASE_COLUMN_PADDING} className={classNames.fileList}>
            {files.map((file, index) => (
              <FileListItem
                key={index}
                file={file}
                index={index}
                handleDeleteClick={functions.handleDelete}
                handlePreviewClick={setPreviewFile}
                className={classNames.fileItem}
              />
            ))}
          </BaseColumn>
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
        <FilePreviewDialog file={previewFile} onClose={() => setPreviewFile(null)} />
      </Stack>
    )
  },
)

type FileListItemProps = {
  file: File
  index: number
  handleDeleteClick: (e: MouseEvent<HTMLButtonElement>) => void
  handlePreviewClick: (file: File) => void
  className: string
}

const FileListItem = memo<FileListItemProps>(
  ({ file, index, handleDeleteClick, handlePreviewClick, className }) => {
    const isPreviewable = isImageOrPdf(file.type)

    const handleFileClick = () => {
      if (isPreviewable) {
        handlePreviewClick(file)
      } else {
        downloadFile(file)
      }
    }

    return (
      <li className={className}>
        <Button
          variant="text"
          prefix={isPreviewable ? <FaFileLinesIcon /> : <FaFileArrowDownIcon />}
          onClick={handleFileClick}
          className="smarthr-ui-InputFile-fileButton"
        >
          {file.name}
        </Button>
        <Button
          variant="text"
          prefix={<FaTrashCanIcon />}
          value={index}
          onClick={handleDeleteClick}
          className="smarthr-ui-InputFile-deleteButton"
        >
          <Localizer id="smarthr-ui/InputFile/destroy" defaultText="削除" />
        </Button>
      </li>
    )
  },
)

const StyledFaFolderOpenIcon = memo<{ className: string }>(({ className }) => (
  <span className={className}>
    <FaFolderOpenIcon />
  </span>
))

const LabelRender = memo<{ id: string; label: ReactNode }>(({ id, label }) => (
  <span id={id} aria-hidden="true">
    {label}
  </span>
))
