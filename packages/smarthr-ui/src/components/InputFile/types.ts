import type { SHRComponentPropsWithRef } from '../../types'
import type { ReactNode } from 'react'

export type PreviewableObjectType = {
  /** プレビューダイアログ内のFileViewerで検索機能を有効にするかどうか */
  searchable?: boolean
}

export type ExistingFile = {
  /** ファイル名 */
  name: string
  /** ファイルのダウンロード・プレビュー用URL */
  url: string
  /** MIMEタイプ。プレビュー可否(画像/PDF判定)に使う。未指定時はダウンロードリンク扱いになる */
  contentType?: string
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
    /** 既にアップロード済みのファイルの初期一覧 */
    defaultExistingFiles?: ExistingFile[]
    /** アップロード済みファイルが削除されたときに発火するコールバック関数 */
    onDeleteExistingFile?: (file: ExistingFile, index: number) => void
  },
  { omit: 'children' }
>
export type LowerProps = Omit<Props, 'previewable'> & {
  previewable: PreviewableObjectType | undefined
}
