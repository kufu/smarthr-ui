import { Color } from '@tiptap/extension-color'
import { FileHandler } from '@tiptap/extension-file-handler'
import { Image } from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Youtube } from '@tiptap/extension-youtube'
import StarterKit from '@tiptap/starter-kit'

import type { ImageUploadResult, RichTextFeature } from '../types'
import type { AnyExtension } from '@tiptap/react'

type ConfigureExtensionsOptions = {
  features?: readonly RichTextFeature[]
  placeholder?: string
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  acceptedMimeTypes?: string[]
}

const DEFAULT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export const configureExtensions = ({
  features = [],
  placeholder,
  onImageUpload,
  acceptedMimeTypes,
}: ConfigureExtensionsOptions): AnyExtension[] => {
  const has = (f: RichTextFeature) => features.includes(f)

  const extensions: AnyExtension[] = [
    StarterKit.configure({
      heading: has('heading') ? { levels: [1, 2, 3, 4] } : false,
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

  if (has('image')) {
    extensions.push(Image.configure({ allowBase64: false }))

    if (onImageUpload) {
      const mimeTypes = acceptedMimeTypes ?? DEFAULT_MIME_TYPES

      extensions.push(
        FileHandler.configure({
          allowedMimeTypes: mimeTypes,
          onDrop: (editor, files, pos) => {
            for (const file of files) {
              if (!mimeTypes.some((type) => file.type === type)) continue
              const formData = new FormData()
              formData.append('file', file)
              onImageUpload(file, formData).then(({ src, alt }) => {
                editor
                  .chain()
                  .focus()
                  .insertContentAt(pos, {
                    type: 'image',
                    attrs: { src, alt: alt ?? file.name },
                  })
                  .run()
              })
            }
          },
          onPaste: (editor, files) => {
            for (const file of files) {
              if (!mimeTypes.some((type) => file.type === type)) continue
              const formData = new FormData()
              formData.append('file', file)
              onImageUpload(file, formData).then(({ src, alt }) => {
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: 'image',
                    attrs: { src, alt: alt ?? file.name },
                  })
                  .run()
              })
            }
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

  if (has('color')) {
    extensions.push(TextStyle.configure(), Color.configure())
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
  'image',
  'youtube',
] as const
