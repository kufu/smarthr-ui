'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
  forwardRef,
  memo,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { useIntl } from '../../intl'
import { BaseColumn } from '../Base'
import { Button } from '../Button'
import { FaFolderOpenIcon, FaTrashCanIcon } from '../Icon'
import { Stack } from '../Layout'

const classNameGenerator = tv({
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

export type Props = VariantProps<typeof classNameGenerator> & {
  /** フォームのラベル */
  label: ReactNode
  /** ファイルの選択に変更があったときに発火するコールバック関数 */
  onChange?: (files: File[]) => void
  /** ファイルリストを表示するかどうか */
  hasFileList?: boolean
  /** コンポーネント内のテキストを変更する関数 */
  decorators?: DecoratorsType<DecoratorKeyTypes>
  error?: boolean
  /** ファイル複数選択の際に、選択済みのファイルと結合するかどうか */
  multiplyAppendable?: boolean
}
type ElementProps = Omit<ComponentPropsWithRef<'input'>, keyof Props>
type DecoratorKeyTypes = 'destroy'

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
      multiplyAppendable = false,
      error,
      decorators,
      ...props
    },
    ref,
  ) => {
    const [files, setFiles] = useState<File[]>([])
    const labelId = useId()
    const { localize } = useIntl()

    const decoratorDefaultTexts = useMemo(
      () => ({
        destroy: localize({
          id: 'smarthr-ui/InputFile/destroy',
          defaultText: '削除',
        }),
      }),
      [localize],
    )

    const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)

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
    const isUpdatingFilesDirectly = useRef(false)

    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current,
    )

    const updateInputFiles = useCallback(
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

    const updateFiles = useMemo(
      () =>
        onChange
          ? (newFiles: File[]) => {
              onChange(newFiles)
              if (multiplyAppendable) {
                // multiplyAppendable以外ではinput要素を直接弄る必要がないので、updateInputFilesを呼ばない
                updateInputFiles(newFiles)
              }
              setFiles(newFiles)
            }
          : (newFiles: File[]) => {
              setFiles(newFiles)
              if (multiplyAppendable) {
                // multiplyAppendable以外ではinput要素を直接弄る必要がないので、updateInputFilesを呼ばない
                updateInputFiles(newFiles)
              }
            },
      [onChange, updateInputFiles, multiplyAppendable],
    )

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        // Safari において、input.files への直接代入時はonChangeを発火させない
        if (isUpdatingFilesDirectly.current) {
          return
        }

        const newFiles = Array.from(e.target.files ?? [])

        if (multiplyAppendable) {
          // multiplyAppendableの場合、すでに選択済みのファイルと結合する
          updateFiles([...files, ...newFiles])
        } else {
          updateFiles(newFiles)
        }
      },
      [files, isUpdatingFilesDirectly, updateFiles, multiplyAppendable],
    )

    const handleDelete = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (!inputRef.current) {
          return
        }

        const index = parseInt(e.currentTarget.value, 10)
        const newFiles = files.filter((_, i) => index !== i)

        // 削除後、同一ファイルを再選択可能にするためinput.valueをリセット
        inputRef.current.value = ''

        updateFiles(newFiles)
      },
      [files, updateFiles],
    )

    return (
      <Stack align="flex-start" className={classNames.wrapper}>
        {!disabled && hasFileList && files.length > 0 && (
          <BaseColumn as="ul" padding={BASE_COLUMN_PADDING} className={classNames.fileList}>
            {files.map((file, index) => (
              <li key={index} className={classNames.fileItem}>
                <span className="smarthr-ui-InputFile-fileName shr-wrap-break-word shr-min-w-[0]">
                  {file.name}
                </span>
                <Button
                  variant="text"
                  prefix={<FaTrashCanIcon />}
                  value={index}
                  onClick={handleDelete}
                  className="smarthr-ui-InputFile-deleteButton"
                >
                  {decorated.destroy}
                </Button>
              </li>
            ))}
          </BaseColumn>
        )}
        <span className={classNames.inputWrapper}>
          <input
            {...props}
            multiple={multiple || multiplyAppendable}
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
