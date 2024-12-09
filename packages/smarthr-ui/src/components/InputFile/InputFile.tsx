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

export const InputFile = forwardRef<HTMLInputElement, Props & ElementProps>(
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
          <input
            {...props}
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
