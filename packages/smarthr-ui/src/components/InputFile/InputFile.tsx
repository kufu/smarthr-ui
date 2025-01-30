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
import { VariantProps, tv } from 'tailwind-variants'

import { BaseColumn } from '../Base'
import { Button } from '../Button'
import { FaFolderOpenIcon, FaTrashCanIcon } from '../Icon'
import { Stack } from '../Layout'

import type { DecoratorsType } from '../../types'

const inputFile = tv({
  slots: {
    wrapper: 'smarthr-ui-InputFile shr-block',
    fileList: ['smarthr-ui-InputFile-fileList', 'shr-list-none shr-self-stretch shr-text-base'],
    fileItem: 'shr-flex shr-items-center',
    inputWrapper: [
      'shr-border-shorthand shr-relative shr-inline-flex shr-rounded-m shr-bg-white shr-font-bold shr-leading-none',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator',
      'has-[[aria-invalid]]:shr-border-danger',
    ],
    input: [
      'smarthr-ui-InputFile-input',
      'shr-absolute shr-left-0 shr-top-0 shr-h-full shr-w-full shr-opacity-0',
      'file:shr-h-full file:shr-w-full file:shr-cursor-pointer',
      'file:disabled:shr-cursor-not-allowed',
    ],
    prefix: 'shr-me-0.5 shr-inline-flex',
  },
  variants: {
    size: {
      default: {
        inputWrapper: 'shr-px-1 shr-py-0.75 shr-text-base',
      },
      s: {
        inputWrapper: 'shr-p-0.5 shr-text-sm',
      },
    },
    disabled: {
      true: {
        inputWrapper: 'shr-border-disabled shr-bg-white-darken shr-text-disabled',
      },
      false: {
        inputWrapper: 'hover:shr-border-darken hover:shr-bg-white-darken hover:shr-text-black',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

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
type ElementProps = Omit<ComponentPropsWithRef<'input'>, keyof Props>

const DESTROY_BUTTON_TEXT = '削除'
const BASE_COLUMN_PADDING = { block: 0.5, inline: 1 } as const

export const InputFile = forwardRef<HTMLInputElement, Props & ElementProps>(
  (
    {
      className,
      size,
      label,
      hasFileList = true,
      onChange,
      disabled = false,
      multiple,
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

    const updateInputValue = useCallback(
      (newFiles: File[]) => {
        if (!inputRef.current) {
          return
        }
        const buff = new DataTransfer()
        newFiles.forEach((file) => {
          buff.items.add(file)
        })

        isUpdatingFilesDirectly.current = true
        inputRef.current.files = buff.files
        isUpdatingFilesDirectly.current = false
      },
      [inputRef],
    )

    const updateFiles = useCallback(
      (newFiles: File[]) => {
        onChange?.(newFiles)
        updateInputValue(newFiles)
        setFiles(newFiles)
      },
      [setFiles, onChange, updateInputValue],
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isUpdatingFilesDirectly.current) {
          return
        }

        const newFiles = Array.from(e.target.files ?? [])

        if (multiple) {
          // multipleの場合、すでに選択済みのファイルと結合する
          updateFiles([...files, ...newFiles])
        } else {
          updateFiles(newFiles)
        }
      },
      [files, isUpdatingFilesDirectly, updateFiles, multiple],
    )

    const handleDelete = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!inputRef.current) {
          return
        }

        const index = parseInt(e.currentTarget.value, 10)
        const newFiles = files.filter((_, i) => index !== i)

        updateFiles(newFiles)
      },
      [files, inputRef, updateFiles],
    )

    return (
      <Stack align="flex-start" className={wrapperStyle}>
        {!disabled && hasFileList && files.length > 0 && (
          <BaseColumn as="ul" padding={BASE_COLUMN_PADDING} className={fileListStyle}>
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className={fileItemStyle}>
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
          {}
          <input
            {...props}
            multiple
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
