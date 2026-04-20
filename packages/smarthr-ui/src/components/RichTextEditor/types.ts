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
  | 'image'
  | 'youtube'

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
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
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

export type RichTextContentProps = {
  content: ExternalRichTextValue | RichTextJSON
  className?: string
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
