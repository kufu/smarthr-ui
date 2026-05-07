import { Color } from '@tiptap/extension-color'
import { FileHandler } from '@tiptap/extension-file-handler'
import { Image } from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { TextAlign } from '@tiptap/extension-text-align'
import { FontSize, TextStyle } from '@tiptap/extension-text-style'
import { Youtube } from '@tiptap/extension-youtube'
import StarterKit from '@tiptap/starter-kit'

import type { ImageUploadResult, RichTextFeature } from '../types'
import type { AnyExtension } from '@tiptap/react'

type ConfigureExtensionsOptions = {
  features?: readonly RichTextFeature[]
  headingLevels?: ReadonlyArray<1 | 2 | 3 | 4>
  placeholder?: string
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onFileDrop?: (file: File, pos: number | null) => void
  acceptedMimeTypes?: string[]
}

const DEFAULT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const DEFAULT_HEADING_LEVELS: ReadonlyArray<1 | 2 | 3 | 4> = [1, 2, 3, 4]

export const configureExtensions = ({
  features = [],
  headingLevels = DEFAULT_HEADING_LEVELS,
  placeholder,
  onImageUpload,
  onFileDrop,
  acceptedMimeTypes,
}: ConfigureExtensionsOptions): AnyExtension[] => {
  const has = (f: RichTextFeature) => features.includes(f)

  const extensions: AnyExtension[] = [
    StarterKit.configure({
      heading: has('heading') && headingLevels.length > 0 ? { levels: [...headingLevels] } : false,
      bold: has('bold') ? {} : false,
      italic: has('italic') ? {} : false,
      strike: has('strike') ? {} : false,
      underline: has('underline') ? {} : false,
      code: has('code') ? {} : false,
      codeBlock: has('codeBlock') ? {} : false,
      blockquote: has('blockquote') ? {} : false,
      bulletList: has('bulletList') ? {} : false,
      orderedList: has('orderedList') ? {} : false,
      horizontalRule: has('horizontalRule') ? {} : false,
      link: has('link')
        ? { openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto'] }
        : false,
    }),
  ]

  if (has('textAlign')) {
    extensions.push(
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    )
  }

  if (has('image')) {
    extensions.push(
      Image.configure({
        allowBase64: false,
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
          minWidth: 100,
          minHeight: 100,
        },
      }),
    )

    if (onImageUpload && onFileDrop) {
      const mimeTypes = acceptedMimeTypes ?? DEFAULT_MIME_TYPES

      extensions.push(
        FileHandler.configure({
          allowedMimeTypes: mimeTypes,
          onDrop: (_editor, files, pos) => {
            const file = files.find((f) => mimeTypes.some((type) => f.type === type))
            if (file) onFileDrop(file, pos)
          },
          onPaste: (_editor, files) => {
            const file = files.find((f) => mimeTypes.some((type) => f.type === type))
            if (file) onFileDrop(file, null)
          },
        }),
      )
    }
  }

  if (has('youtube')) {
    extensions.push(
      Youtube.configure({
        nocookie: true,
        allowFullscreen: true,
      }),
    )
  }

  if (has('table')) {
    extensions.push(Table.configure({ resizable: true }), TableRow, TableHeader, TableCell)
  }

  if (has('color') || has('fontSize')) {
    extensions.push(TextStyle.configure())
  }

  if (has('color')) {
    extensions.push(Color.configure())
  }

  if (has('fontSize')) {
    extensions.push(FontSize.configure())
  }

  if (placeholder) {
    extensions.push(
      Placeholder.configure({
        placeholder,
      }),
    )
  }

  return extensions
}

/** 全feature有効のextensions（serializer用） */
export const ALL_FEATURES: readonly RichTextFeature[] = [
  'bold',
  'italic',
  'strike',
  'underline',
  'code',
  'codeBlock',
  'bulletList',
  'orderedList',
  'blockquote',
  'horizontalRule',
  'link',
  'heading',
  'color',
  'fontSize',
  'textAlign',
  'image',
  'youtube',
  'table',
] as const
