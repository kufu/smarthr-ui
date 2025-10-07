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

import { InputFileMultiplyAppendable } from './InputFileMultiplyAppendable'
import { InputFileNative } from './InputFileNative'

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

export const InputFile = forwardRef<HTMLInputElement, Props & ElementProps>((props, ref) => {
  if (props.multiple && props.multiplyAppendable) {
    return <InputFileMultiplyAppendable {...props} ref={ref} />
  }
})
