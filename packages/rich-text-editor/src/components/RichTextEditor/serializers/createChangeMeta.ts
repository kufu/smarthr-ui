import { createNodeFromContent, getText, isNodeEmpty } from '@tiptap/core'

import { getRichTextSchema, getRichTextSerializers } from './richTextSchema'
import { serializeToHTML } from './serializeToHTML'

import type { RichTextChangeMeta, RichTextJSON } from '../types'
import type { Node } from '@tiptap/pm/model'

/** editor.getText() の既定値。ブロックの区切りは空行になる */
const BLOCK_SEPARATOR = '\n\n'

/**
 * editor 由来の値。onUpdate の時点で読み取って渡すことで、
 * 後続の編集で meta の中身が変わらないようにする。
 */
export type RichTextSnapshot = {
  isEmpty: boolean
  text: string
}

const toNode = (json: RichTextJSON): Node =>
  createNodeFromContent(json, getRichTextSchema(), { errorOnInvalidContent: false }) as Node

export const isEmptyDocument = (json: RichTextJSON): boolean => isNodeEmpty(toNode(json))

/**
 * editor を経由しない呼び出しでも同じ結果を返すため、
 * Tiptap が editor.isEmpty / editor.getText() で使うのと同じ helper を通す。
 */
const deriveFromJSON = (json: RichTextJSON) => {
  const node = toNode(json)
  const textSerializers = getRichTextSerializers()

  return {
    isEmpty: isNodeEmpty(node),
    text: getText(node, { blockSeparator: BLOCK_SEPARATOR, textSerializers }),
    // 文字数はブロックの区切りを数えない
    characterCount: getText(node, { blockSeparator: '', textSerializers }).length,
  }
}

export const createChangeMeta = (
  json: RichTextJSON,
  characterCount?: number,
  snapshot?: RichTextSnapshot,
): RichTextChangeMeta => {
  let derived: ReturnType<typeof deriveFromJSON> | undefined
  const getDerived = () => {
    if (!derived) derived = deriveFromJSON(json)

    return derived
  }

  let _html: string | undefined

  return {
    json,
    get html() {
      if (_html === undefined) _html = serializeToHTML(json)
      return _html
    },
    text: snapshot ? snapshot.text : getDerived().text,
    isEmpty: snapshot ? snapshot.isEmpty : getDerived().isEmpty,
    characterCount: characterCount ?? getDerived().characterCount,
  }
}
