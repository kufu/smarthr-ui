import type { RichTextJSON } from '../types'
import type { Editor } from '@tiptap/core'

/**
 * editor.getJSON() をそのまま渡さないのは、attrs が文書と同じオブジェクトのため。
 * 受け取った側が書き換えると、エディタの文書まで書き換わる
 */
export const getDetachedJSON = (editor: Editor): RichTextJSON =>
  structuredClone(editor.getJSON()) as RichTextJSON
