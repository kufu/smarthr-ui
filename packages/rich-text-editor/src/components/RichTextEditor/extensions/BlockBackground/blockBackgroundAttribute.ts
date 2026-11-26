import { Extension } from '@tiptap/core'

import { comparableColor } from '../../../../libs/normalizeHex'
import { isSafeColor } from '../../serializers/safeAttributes'

import type { RichTextFeature } from '../../types'
import type { Node as PMNode } from '@tiptap/pm/model'

/**
 * 表のセルと同じ backgroundColor にせず feature 名と同じにするのは、表のセルの backgroundColor（feature 'backgroundColor'）と
 * 名前で分かれ、pasteFilter の「属性名 → feature」の表が textAlign・lineHeight と同じく恒等の対応で済むため
 */
export const BLOCK_BACKGROUND_ATTRIBUTE = 'blockBackgroundColor' satisfies RichTextFeature

export const BLOCK_BACKGROUND_TYPES = ['paragraph', 'heading', 'bulletList', 'orderedList'] as const

export type BlockBackgroundType = (typeof BLOCK_BACKGROUND_TYPES)[number]

export const BLOCK_BACKGROUND_DATA_ATTRIBUTE = 'data-block-background'

export const isBlockBackgroundType = (typeName: string): typeName is BlockBackgroundType =>
  (BLOCK_BACKGROUND_TYPES as readonly string[]).includes(typeName)

export const blockBackgroundOf = (node: PMNode): string | null => {
  const color = node.attrs[BLOCK_BACKGROUND_ATTRIBUTE]

  return isBlockBackgroundType(node.type.name) && isSafeColor(color) ? color : null
}

// 文字列のまま比べないのは、貼り付けや HTML の読み込みでは同じ色が rgb() 表記で入るため
export const hasBlockBackground = (node: PMNode, color: string | null) =>
  comparableColor(blockBackgroundOf(node)) === comparableColor(color)

/** 型名を見ないのは、属性名を表のセルの backgroundColor と分けたので、キーの有無だけで帯と分かるため */
export const placeBlockBackground = (
  attrs: Record<string, unknown>,
  depth: number,
): Record<string, unknown> =>
  depth === 1 || (attrs[BLOCK_BACKGROUND_ATTRIBUTE] ?? null) === null
    ? attrs
    : { ...attrs, [BLOCK_BACKGROUND_ATTRIBUTE]: null }

/**
 * コマンドと正規化をここに持たないのは、serializer からも読むため。
 *
 * 余白を renderHTML の style に入れないのは、保存した HTML にデザインの値が焼き込まれ、
 * あとから差し替えられなくなるため。余白は styles.ts の blockBackgroundClasses が当てる
 */
export const BlockBackgroundAttribute = Extension.create({
  name: 'blockBackground',

  addGlobalAttributes() {
    return [
      {
        types: [...BLOCK_BACKGROUND_TYPES],
        attributes: {
          [BLOCK_BACKGROUND_ATTRIBUTE]: {
            default: null,
            keepOnSplit: false,
            // data 属性の無い background-color を取り込まないのは、Word などの段落の網かけまで帯になるため
            parseHTML: (element: HTMLElement) =>
              element.hasAttribute(BLOCK_BACKGROUND_DATA_ATTRIBUTE) &&
              isSafeColor(element.style.backgroundColor)
                ? element.style.backgroundColor
                : null,
            // null を返さないのは、static-renderer が生の属性名をそのまま出すため
            renderHTML: (attributes: Record<string, unknown>) => {
              const color = attributes[BLOCK_BACKGROUND_ATTRIBUTE]

              return isSafeColor(color)
                ? { [BLOCK_BACKGROUND_DATA_ATTRIBUTE]: '', style: `background-color: ${color}` }
                : {}
            },
          },
        },
      },
    ]
  },
})
