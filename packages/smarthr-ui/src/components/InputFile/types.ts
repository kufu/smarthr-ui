import type { classNameGenerator } from './style'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

export type PreviewableObjectType = {
  /** プレビューダイアログ内のFileViewerで検索機能を有効にするかどうか */
  searchable?: boolean
}

type BaseProps = VariantProps<typeof classNameGenerator> & {
  /** フォームのラベル */
  label: ReactNode
  /** ファイルの選択に変更があったときに発火するコールバック関数 */
  onChange?: (files: File[]) => void
  /** ファイルリストを表示するかどうか */
  hasFileList?: boolean
  /** ファイルのプレビュー機能を有効にするかどうか */
  previewable?: boolean | PreviewableObjectType
  error?: boolean
  multiple?:
    | boolean
    | {
        /** ファイル複数選択の際に、選択済みのファイルと結合するかどうか */
        appendable?: boolean
      }
}
export type Props = BaseProps & Omit<ComponentPropsWithRef<'input'>, keyof BaseProps>
export type LowerProps = Omit<Props, 'previewable'> & {
  previewable: PreviewableObjectType | undefined
}
