import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'

import type { RichTextFeature } from '../types'
import type { AnyExtension } from '@tiptap/react'

type ConfigureExtensionsOptions = {
  features?: readonly RichTextFeature[]
  placeholder?: string
}

export const configureExtensions = ({
  features = [],
  placeholder,
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
] as const
