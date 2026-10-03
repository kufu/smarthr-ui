import { renderToHTMLString } from '@tiptap/static-renderer'

import { getRichTextExtensions, getRichTextSchema } from './richTextSchema'
import { sanitizeRichTextJSON } from './sanitizeRichTextJSON'

import type { JSONContent } from '@tiptap/core'

import { generateJSON } from '#html'

const joinChildren = (children?: string | string[]) =>
  Array.isArray(children) ? children.join('') : (children ?? '')

/**
 * エディタへ読み込む JSON を、schema に合う形へ直す。
 *
 * Tiptap は schema に合わない JSON を受け取ると警告を出して文書全体を空にするため、
 * 1か所の破損で残りの内容まで消え、そのまま保存されると元に戻せない。
 * 未知の型を ProseMirror の JSON のまま中身へ置き換えると、ブロックの位置に文字が来るなど
 * content 式に合わなくなる。HTML を経由すると DOMParser 側の解釈で段落に包み直されるため、
 * 直接読み込めないときだけこの経路を通す。
 */
export const toEditorContent = (json: unknown): JSONContent => {
  const sanitized = sanitizeRichTextJSON(json)

  try {
    getRichTextSchema().nodeFromJSON(sanitized).check()

    return sanitized
  } catch (error) {
    console.warn(
      'RichTextEditor: schema に合わない内容を含むため、読み込める形に直しました。装飾や要素の一部が失われている場合があります。',
      error,
    )

    const html = renderToHTMLString({
      content: sanitized,
      extensions: getRichTextExtensions(),
      options: {
        unhandledNode: ({ children }) => joinChildren(children),
        unhandledMark: ({ children }) => joinChildren(children),
      },
    })

    return generateJSON(html, getRichTextExtensions())
  }
}
