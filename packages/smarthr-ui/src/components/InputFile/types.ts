import type { SHRComponentPropsWithRef } from '../../types'
import type { ReactNode } from 'react'

export type PreviewableObjectType = {
  /** プレビューダイアログ内のFileViewerで検索機能を有効にするかどうか */
  searchable?: boolean
}

export type Props = SHRComponentPropsWithRef<
  'input',
  {
    /** コンポーネントのサイズ */
    size?: 'M' | 'S'
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
  },
  { omit: 'children' }
>
export type LowerProps = Omit<Props, 'previewable'> & {
  previewable: PreviewableObjectType | undefined
}
