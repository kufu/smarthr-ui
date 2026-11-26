import { combineTransactionSteps, getChangedRanges } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

import { isSafeColor } from '../../serializers/safeAttributes'
import { resolveBlockRange } from '../Block/blockRange'
import { isList } from '../blockCatalog'

import {
  BLOCK_BACKGROUND_ATTRIBUTE,
  BlockBackgroundAttribute,
  blockBackgroundOf,
  hasBlockBackground,
  isBlockBackgroundType,
} from './blockBackgroundAttribute'

import type { RichTextFeature } from '../../types'
import type { Node as PMNode, ResolvedPos } from '@tiptap/pm/model'
import type { EditorState, Selection } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  // declaration merging が必要なため interface を使用
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Commands<ReturnType> {
    blockBackground: {
      /**
       * 選択がまたぐ最上位の段落・見出し・リストに帯を付ける。null で外す。
       * リストの中のキャレットではリスト全体に付く。付けられるブロックが無いとき・色が不正なときは false
       */
      setBlockBackgroundColor: (color: string | null) => ReturnType
    }
  }
}

type BlockBackgroundOptions = {
  getFeatures: () => readonly RichTextFeature[]
}

const isNestedOnlyInLists = ($pos: ResolvedPos) => {
  for (let depth = $pos.depth; depth > 1; depth--) {
    if (!isBlockBackgroundType($pos.node(depth).type.name) && !isList($pos.node(depth - 1))) {
      return false
    }
  }

  return true
}

/**
 * updateAttributes を使わないのは、リストの項目や表のセルの中の段落にも当たるため。
 * 選択の端から直接数えないのは、全選択で末尾に足された空の段落まで含めてしまうため。
 * 1 つのブロックの中で引用・表・コードブロックの中から最上位を見ないのは、リストの項目の中のそれらから
 * リスト全体を塗り替えてしまうため。そのブロックの外にある端を見ないのは、行を選ぶと次のブロックの先頭まで
 * 選ばれやすく、次がコードブロックで始まる引用などだとその行も塗れなくなるため。
 * 2 つ以上のブロックにまたがるときに端を見ないのは、端が表や引用の中にあるだけで、またいだ段落やリストまで塗れなくなるため
 */
const blockBackgroundTargets = (doc: PMNode, selection: Selection) => {
  const { from, startIndex, endIndex } = resolveBlockRange(doc, selection)

  if (
    endIndex - startIndex === 1 &&
    [selection.$from, selection.$to].some(
      ($pos) => $pos.index(0) === startIndex && !isNestedOnlyInLists($pos),
    )
  ) {
    return []
  }

  const targets: Array<{ pos: number; node: PMNode }> = []
  let pos = from

  for (let index = startIndex; index < endIndex; index++) {
    const node = doc.child(index)

    if (isBlockBackgroundType(node.type.name)) targets.push({ pos, node })

    pos += node.nodeSize
  }

  return targets
}

export const readBlockBackgroundTarget = (
  state: EditorState,
): { available: boolean; color: string | null } => {
  const targets = blockBackgroundTargets(state.doc, state.selection)
  const color = targets.length > 0 ? blockBackgroundOf(targets[0].node) : null

  return {
    available: targets.length > 0,
    color: targets.every(({ node }) => hasBlockBackground(node, color)) ? color : null,
  }
}

/**
 * 変わった範囲そのものではなく、触れた最上位のブロックごと調べるのは、引用で包むときの変化の範囲が
 * 包んだ印の位置だけで、中へ入った段落やリストが範囲に含まれないため
 */
const findMisplacedBlockBackgrounds = (
  doc: PMNode,
  changedRanges: ReadonlyArray<{ from: number; to: number }>,
) => {
  const indexes = new Set<number>()

  for (const { from, to } of changedRanges) {
    const last = Math.min(doc.resolve(to).index(0), doc.childCount - 1)

    for (let index = doc.resolve(from).index(0); index <= last; index++) indexes.add(index)
  }

  const positions: number[] = []

  doc.forEach((top, topPos, index) => {
    if (indexes.has(index)) {
      top.descendants((child, offset) => {
        if ((child.attrs[BLOCK_BACKGROUND_ATTRIBUTE] ?? null) !== null) {
          positions.push(topPos + 1 + offset)
        }

        return !child.isTextblock
      })
    }
  })

  return positions
}

const NORMALIZE_KEY = new PluginKey('blockBackgroundNormalize')

/** restrict で包まないのは、features から外したときに正規化まで剥がれ、既存の帯が入れ子のまま残るため */
export const BlockBackground = BlockBackgroundAttribute.extend<BlockBackgroundOptions>({
  addOptions() {
    return { getFeatures: () => [] }
  },

  addCommands() {
    // restrict と Tiptap に任せないのは、restrict はコマンドを剥がさず、Tiptap のコマンドは editable も見ないため
    const isActive = () =>
      this.editor.isEditable && this.options.getFeatures().includes('blockBackgroundColor')

    return {
      setBlockBackgroundColor:
        (color) =>
        ({ tr, dispatch }) => {
          if (!isActive() || (color !== null && !isSafeColor(color))) return false

          const targets = blockBackgroundTargets(tr.doc, tr.selection)

          if (targets.length === 0) return false

          if (dispatch) {
            for (const { pos, node } of targets) {
              // 同じ色のブロックにも書かないのは、空の変更でも取り消しの単位が増えるため
              if (!hasBlockBackground(node, color)) {
                tr.setNodeAttribute(pos, BLOCK_BACKGROUND_ATTRIBUTE, color)
              }
            }
          }

          return true
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: NORMALIZE_KEY,
        // 外へ移さず落とすだけにするのは、移すと wrapInList でつながった別のリストに帯が広がるため。
        // 移す・保つは操作の前の文書を知っている carryBlockBackground が決める
        appendTransaction: (transactions, oldState, newState) => {
          // 選択だけのトランザクションに足さないのは、onChange と取り消しの履歴が増えるため
          if (!transactions.some(({ docChanged }) => docChanged)) return null

          const positions = findMisplacedBlockBackgrounds(
            newState.doc,
            getChangedRanges(combineTransactionSteps(oldState.doc, [...transactions])).map(
              ({ newRange }) => newRange,
            ),
          )

          if (positions.length === 0) return null

          const { tr } = newState

          for (const pos of positions) tr.setNodeAttribute(pos, BLOCK_BACKGROUND_ATTRIBUTE, null)

          return tr
        },
      }),
    ]
  },
})
