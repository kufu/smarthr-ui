import type { classNameGenerator } from './style'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

type AbstractProps = VariantProps<typeof classNameGenerator> & {
  /** フォームのラベル */
  label: ReactNode
  /** ファイルの選択に変更があったときに発火するコールバック関数 */
  onChange?: (files: File[]) => void
  /** ファイルリストを表示するかどうか */
  hasFileList?: boolean
  error?: boolean
  multiple?:
    | boolean
    | {
        /** ファイル複数選択の際に、選択済みのファイルと結合するかどうか */
        appendable?: boolean
      }
}
export type Props = AbstractProps & Omit<ComponentPropsWithRef<'input'>, keyof AbstractProps>
