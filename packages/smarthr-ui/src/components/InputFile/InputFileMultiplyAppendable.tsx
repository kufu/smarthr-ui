'use client'

import {
  type ChangeEvent,
  type MouseEvent,
  type PropsWithChildren,
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
import { useIntl } from '../../intl'
import { BaseColumn } from '../Base'
import { Button } from '../Button'
import { FaFolderOpenIcon, FaTrashCanIcon } from '../Icon'
import { Stack } from '../Layout'

import { classNameGenerator } from './style'

import type { Props } from './types'

const BASE_COLUMN_PADDING = { block: 0.5, inline: 1 } as const

export const InputFileMultiplyAppendable = forwardRef<HTMLInputElement, Omit<Props, 'multiple'>>(
  (
    { className, size, label, hasFileList = true, onChange, disabled = false, error, ...rest },
    ref,
  ) => {
    const [files, setFiles] = useState<File[]>([])
    const labelId = useId()
    const { localize } = useIntl()

    const destroyLabel = useMemo(
      () =>
        localize({
          id: 'smarthr-ui/InputFile/destroy',
          defaultText: '削除',
        }),
      [localize],
    )

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

    const { handleChange, handleDelete } = useMemo(() => {
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
                value={index}
                onDeleteClick={handleDelete}
                destroyLabel={destroyLabel}
                className={classNames.fileItem}
              >
                {file.name}
              </FileListItem>
            ))}
          </BaseColumn>
        )}
        <span className={classNames.inputWrapper}>
          <input
            {...rest}
            multiple
            data-smarthr-ui-input="true"
            type="file"
            onChange={handleChange}
            disabled={disabled}
            ref={inputRef}
            aria-invalid={error || undefined}
            aria-labelledby={labelId}
            className={classNames.input}
          />
          <StyledFaFolderOpenIcon className={classNames.prefix} />
          <LabelRender id={labelId} label={label} />
        </span>
      </Stack>
    )
  },
)

type FileListItemProps = PropsWithChildren<{
  value: number
  onDeleteClick: (e: MouseEvent<HTMLButtonElement>) => void
  destroyLabel: string
  className: string
}>

const FileListItem = memo<FileListItemProps>(
  ({ value, onDeleteClick, destroyLabel, className, children }) => (
    <li className={className}>
      <span className="smarthr-ui-InputFile-fileName">{children}</span>
      <Button
        variant="text"
        prefix={<FaTrashCanIcon />}
        value={value}
        onClick={onDeleteClick}
        className="smarthr-ui-InputFile-deleteButton"
      >
        {destroyLabel}
      </Button>
    </li>
  ),
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
