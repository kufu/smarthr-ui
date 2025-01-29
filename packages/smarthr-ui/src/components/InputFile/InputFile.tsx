import React, { ComponentPropsWithRef, ReactNode, forwardRef } from 'react'
import { VariantProps } from 'tailwind-variants'

import { InputFileMultiple } from './InputFileMultiple'
import { InputFileSingle } from './InputFileSingle'
import { inputFile } from './style'

import type { DecoratorsType } from '../../types'

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

export const InputFile = forwardRef<HTMLInputElement, Props & ElementProps>(
  ({ multiple, ...props }, ref) => {
    if (multiple) {
      return <InputFileMultiple {...props} ref={ref} />
    }
    return <InputFileSingle {...props} ref={ref} />
  },
)
