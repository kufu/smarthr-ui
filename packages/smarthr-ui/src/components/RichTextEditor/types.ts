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

export type RichTextChangeMeta = {
  json: RichTextJSON
  html: string
  text: string
  isEmpty: boolean
  characterCount: number
}

export type RichTextEditorProps = {
  value?: RichTextJSON
  defaultValue?: RichTextJSON
  onChange?: (value: RichTextJSON, meta: RichTextChangeMeta) => void
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
}

export type FlexibleRichTextEditorProps = {
  content?: ExternalRichTextValue
  value?: RichTextJSON
  defaultValue?: RichTextJSON
  outputFormat?: 'json' | 'html'
  onChange?: (value: RichTextJSON | string, meta: RichTextChangeMeta) => void
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
}

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
