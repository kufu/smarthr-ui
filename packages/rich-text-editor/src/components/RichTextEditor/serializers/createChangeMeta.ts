import { getCharacterCount } from './getCharacterCount'
import { getDetachedJSON } from './getDetachedJSON'
import { getPlainText } from './getPlainText'
import { serializeToHTML } from './serializeToHTML'

import type { RichTextChangeMeta } from '../types'
import type { Editor } from '@tiptap/core'

/**
 * 値はすべて通知した時点の editor から読み、後続の編集で meta の中身が変わらないようにする。
 */
export const createChangeMeta = (editor: Editor): RichTextChangeMeta => {
  const { doc, schema } = editor.state
  let html: string | undefined
  let text: string | undefined

  return {
    json: getDetachedJSON(editor),
    // 利用者に渡す json からは作らない。受け取った値を書き換えられると、ほかの値と食い違うため
    get html() {
      html ??= serializeToHTML(doc.toJSON())

      return html
    },
    get text() {
      text ??= getPlainText(doc, schema)

      return text
    },
    isEmpty: editor.isEmpty,
    characterCount: getCharacterCount(doc, schema),
  }
}
