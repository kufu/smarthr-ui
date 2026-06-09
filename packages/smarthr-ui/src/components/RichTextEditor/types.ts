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
  src: string
  alt?: string
}

type RichTextEditorBaseProps = {
  content?: ExternalRichTextValue
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
  className?: string
  editorClassName?: string
  headingLevels?: ReadonlyArray<1 | 2 | 3 | 4>
  showCharacterCount?: boolean
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  /** 画像アップロード失敗時に呼ばれる。通知方法は利用者に委ねる。 */
  onImageUploadError?: (error: unknown, file: File) => void
  /** 画像がドキュメントから削除されたときに、その画像の src ごとに呼ばれる。 */
  onImageRemove?: (src: string) => void
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
  content: ExternalRichTextValue | RichTextJSON
  className?: string
  /** ブロック要素間の縦間隔。デフォルトは 1（16px）。 */
  gap?: RichTextViewerGap
}

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
