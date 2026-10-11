import type { JSONContent } from '@tiptap/core'

export type RichTextJSON = JSONContent

export type ExternalRichTextValue =
  | { format: 'json'; content: RichTextJSON }
  | { format: 'html'; content: string }
  | { format: 'empty'; content?: null }

export type RichTextFeature =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'underline'
  | 'code'
  | 'codeBlock'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'horizontalRule'
  | 'link'
  | 'heading'
  | 'color'
  | 'backgroundColor'
  | 'fontSize'
  | 'lineHeight'
  | 'textAlign'
  | 'image'
  | 'youtube'
  | 'table'

export type RichTextChangeMeta = {
  json: RichTextJSON
  html: string
  text: string
  isEmpty: boolean
  characterCount: number
}

export type ImageUploadResult = {
  /**
   * http(s) の絶対 URL、または `/` から始まるルート相対パス。
   * blob: や data:、相対パスを返すと onImageUploadError が呼ばれ、画像は挿入されない。
   */
  src: string
  alt?: string
}

type RichTextEditorBaseProps = {
  content?: ExternalRichTextValue
  /**
   * 表示する内容（controlled）。内容が変わったときだけ本文を差し替え、編集の履歴は残す。
   *
   * 別のレコードの本文へ切り替えるときは `key` も変えてエディタを作り直すこと。
   * 同じエディタのまま差し替えると、元に戻す操作で切り替え前の本文が戻ってしまう。
   */
  value?: RichTextJSON
  defaultValue?: RichTextJSON
  onFocus?: () => void
  onBlur?: () => void
  features?: readonly RichTextFeature[]
  hideToolbar?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  placeholder?: string
  /**
   * 本文の id。FormControl を使わずに `<label htmlFor>` と紐付けるときに使う。
   * 本文は label 要素で紐付けられないため、label にも id を付けること（その id を aria-labelledby で参照する）。
   *
   * FormControl の中では、label に htmlFor を指定していなければ FormControl のラベルがこの id を指す。
   * 描画後に値を変えても FormControl のラベルは追従しない（Input と同じ）
   */
  id?: string
  /**
   * 本文の名前。FormControl を使わず、見えるラベルも置けないときに使う。
   * FormControl のラベルや id で紐付いた label より優先する（ネイティブの入力要素と同じ）
   */
  'aria-label'?: string
  /** 本文の名前になる要素の id。指定すると FormControl のラベルより優先する */
  'aria-labelledby'?: string
  /** 本文の説明になる要素の id。FormControl の中では、FormControl の補足やエラーの前に並ぶ */
  'aria-describedby'?: string
  className?: string
  editorClassName?: string
  /** コンポーネント全体の幅 */
  width?: number | string
  /** エディタ領域の高さ。resizable のときは初期値として扱う */
  height?: number | string
  /** エディタ領域を縦方向にリサイズできるようにする */
  resizable?: boolean
  headingLevels?: ReadonlyArray<1 | 2 | 3 | 4>
  showCharacterCount?: boolean
  /**
   * 画像をアップロードする。アップロード先は利用者が用意する。
   *
   * エディタはファイルの削除を行わない（編集中の削除は undo で取り消せるうえ、
   * リロードやタブ閉じでは通知もできないため）。不要になった画像の回収は、
   * 保存確定時に旧文書との差分をサーバ側で取って行う。
   */
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  /** 画像アップロード失敗時に呼ばれる。通知方法は利用者に委ねる。 */
  onImageUploadError?: (error: unknown, file: File) => void
  /**
   * 画像として受け付ける MIME type。`image/*` のようなワイルドカードを指定できる。
   * 未指定のときは jpeg / png / gif / webp。
   *
   * ファイル選択ダイアログ・ドラッグ&ドロップ・貼り付けのすべてに適用される。
   * 一致しないファイルのドロップ・貼り付けは無視される。
   */
  acceptedMimeTypes?: string[]
}

export type RichTextEditorProps = RichTextEditorBaseProps &
  (
    | {
        outputFormat?: 'json'
        onChange?: (value: RichTextJSON, meta: RichTextChangeMeta) => void
      }
    | {
        outputFormat: 'html'
        onChange?: (value: string, meta: RichTextChangeMeta) => void
      }
  )

/**
 * ブロック要素間の縦間隔として使える数値トークン。
 * smarthr-ui の spacing 数値トークンに対応する。
 */
export type RichTextViewerGap = 0 | 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 8

export type RichTextViewerProps = {
  /**
   * 表示する内容。
   *
   * 壊れた部分は例外を投げずに取り除いて描画する。別バージョンで保存された未知の型は、
   * 装飾を外して中身の文字だけを残す。それでも描画できない場合は空で描画し、
   * `console.error` にエラーを出力する。
   */
  content: ExternalRichTextValue | RichTextJSON
  className?: string
  /** ブロック要素間の縦間隔。デフォルトは 1（16px）。 */
  gap?: RichTextViewerGap
}

/**
 * 書式を変える操作（toggleXxx・setHeading・setLink・unsetLink）は、disabled / readOnly のあいだ何もしない。
 * clear はプログラムからのリセットとして disabled / readOnly でも効き、onChange も呼ぶ。
 */
export type RichTextEditorController = {
  focus: () => void
  clear: () => void
  getJSON: () => RichTextJSON
  getHTML: () => string
  getText: () => string
  isEmpty: () => boolean
  toggleBold: () => void
  toggleItalic: () => void
  toggleBulletList: () => void
  toggleOrderedList: () => void
  toggleBlockquote: () => void
  setHeading: (level: 1 | 2 | 3 | 4) => void
  setLink: (href: string) => void
  unsetLink: () => void
}
