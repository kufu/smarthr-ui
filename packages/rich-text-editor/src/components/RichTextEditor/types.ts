import type { JSONContent } from '@tiptap/core'

/** 中身を JSONContent のまま絞らないのは、保存済みのデータや別バージョンの schema の値を受け付けるため */
export type RichTextJSON = JSONContent & { type: 'doc' }

export type ExternalRichTextValue =
  | { format: 'json'; content: RichTextJSON }
  | { format: 'html'; content: string }
  | { format: 'empty'; content?: null }

export type RichTextValue = RichTextJSON | ExternalRichTextValue

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
  readonly json: RichTextJSON
  readonly html: string
  readonly text: string
  readonly isEmpty: boolean
  readonly characterCount: number
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
  /**
   * 表示する内容（controlled）。渡すと `defaultValue` は無視する。
   * 内容が変わったときだけ本文を差し替え、編集の履歴は残す。
   *
   * JSON はそのまま、HTML は `{ format: 'html', content }` で渡す。出力の形式は `outputFormat` で決まり、
   * 入力の形式とは独立している（HTML で読み込んで JSON で受け取ることもできる）。
   *
   * 別のレコードの本文へ切り替えるときは `key` も変えてエディタを作り直すこと。
   * 同じエディタのまま差し替えると、元に戻す操作で切り替え前の本文が戻ってしまう。
   */
  value?: RichTextValue
  /**
   * 初期値。エディタの作成時に1回だけ読む。形式は `value` と同じ。
   * 別のレコードの本文へ切り替えるときは `key` を変えてエディタを作り直すこと。
   */
  defaultValue?: RichTextValue
  onFocus?: () => void
  onBlur?: () => void
  features?: readonly RichTextFeature[]
  /**
   * ツールバーを表示しない。画像・動画・表の上に出るメニューも表示しないため、ツールバーからの挿入と
   * 表の行・列の操作はできなくなる。features で許可したものは、貼り付けやドロップでは入る。
   * ドラッグでのサイズ変更と、features で許可した書式のショートカット・入力ルールは使える。
   * ツールバーやメニューへ移るキー操作（Alt+F10・Alt+Enter など）と、リンクを編集する Cmd+K は効かない。
   */
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
   * エディタが確かめるのはブラウザが申告する MIME type（`file.type`）だけで、ファイルサイズも制限しない。
   * 中身の形式やサイズの検証はサーバ側で必ず行うこと。
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
   * `image/*` は SVG（`image/svg+xml`）も通す。SVG はスクリプトを含められるため、受け付けるならサーバ側で
   * 無害化するか、別のオリジンから配信すること。
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
   * 装飾を外して中身の文字だけを残す。形式が解決できない値（未知の format など）は空で描画し、
   * `console.warn` に警告を出力する。それでも描画できない場合は空で描画し、
   * `console.error` にエラーを出力する。
   */
  content: RichTextValue
  className?: string
  /** ブロック要素間の縦間隔。デフォルトは 1（16px）。 */
  gap?: RichTextViewerGap
}

/**
 * 外部のボタンからよく使う書式を適用するための最小限の API。ref から操作できる書式はここにあるものだけ。
 * 標準のツールバーを置き換える用途は想定していない（選択中の書式を読み取る手段が無い）。
 *
 * 書式を変える操作（toggleXxx・setHeading・setLink・unsetLink）は、disabled / readOnly のあいだと、
 * 対応する書式が `features` に無いときは何もしない（既存の書式の解除も含む）。setHeading は `headingLevels` に無いレベルでも何もしない。
 * setLink は前後の空白を取り除き、`http(s)://` で始まるホストのある URL か宛先のある `mailto:` でなければ何もしない（ツールバーのリンクボタンと同じ基準）。
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
