import { InputRule } from '@tiptap/core'

import { type BlockRange, blockRangeAt } from '../Block/blockRange'
import { isList } from '../blockCatalog'

import {
  BLOCK_BACKGROUND_ATTRIBUTE,
  type BlockBackgroundType,
  blockBackgroundOf,
  hasBlockBackground,
  isBlockBackgroundType,
} from './blockBackgroundAttribute'

import type { AnyExtension, CommandProps, RawCommands } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'
import type { Selection, Transaction } from '@tiptap/pm/state'
import type { Mappable } from '@tiptap/pm/transform'

type Source = { node: PMNode; pos: number; role: 'selected' | 'adjacentList' }

type CarryInput = { before: PMNode; range: BlockRange; mapping: Mappable }

const sourcesAround = (doc: PMNode, { from, to, startIndex, endIndex }: BlockRange) => {
  const sources: Source[] = []
  const previous = startIndex > 0 ? doc.child(startIndex - 1) : null
  const next = endIndex < doc.childCount ? doc.child(endIndex) : null

  if (previous && isList(previous)) {
    sources.push({ node: previous, pos: from - previous.nodeSize, role: 'adjacentList' })
  }

  for (let index = startIndex, pos = from; index < endIndex; index++) {
    const node = doc.child(index)

    sources.push({ node, pos, role: 'selected' })
    pos += node.nodeSize
  }

  if (next && isList(next)) sources.push({ node: next, pos: to, role: 'adjacentList' })

  return sources
}

/**
 * 出どころを見分ける位置をブロックの境目にせず段落の中（pos + 1）にするのは、境目は写した先が隣のブロックに寄りうるため。
 * 隣のリストの段落をすべて写さないのは、つながっていれば全体が同じブロックに入り、つながっていなければそのリスト自身に写り、
 * 1 点で足りるため
 */
const contentPoints = ({ node, pos, role }: Source) => {
  if (node.isTextblock) return [pos + 1]
  if (node.isAtom) return [pos]

  const points: number[] = []

  node.descendants((child, offset) => {
    if (role === 'adjacentList' && points.length > 0) return false
    if (child.isTextblock || child.isAtom) {
      points.push(pos + 1 + offset + (child.isTextblock ? 1 : 0))

      return false
    }

    return true
  })

  return points
}

/**
 * 選択の中のブロックの帯をつながった隣のリストの帯より優先しないのは、選択していないブロックの見た目が変わるため。
 * 色の違うリストを分け直さず属性だけを付け直すのは、帯の有無で文書の形（リストの数・番号）が変わらないようにするため
 */
const planCarriedBlockBackground = (after: PMNode, { before, range, mapping }: CarryInput) => {
  const sources = sourcesAround(before, range)

  if (sources.every(({ node }) => blockBackgroundOf(node) === null)) return []

  const contributors = new Map<number, Source[]>()

  for (const source of sources) {
    for (const point of contentPoints(source)) {
      const { pos, deletedAcross } = mapping.mapResult(point, 1)

      if (deletedAcross) continue

      const index = after.resolve(pos).index(0)
      const list = contributors.get(index) ?? []

      if (index < after.childCount && !list.includes(source)) {
        contributors.set(index, [...list, source])
      }
    }
  }

  const patches: Array<{ pos: number; color: string | null }> = []

  after.forEach((target, pos, index) => {
    const list = contributors.get(index)

    if (!list || !isBlockBackgroundType(target.type.name)) return

    const decisive = list.find(({ role }) => role === 'adjacentList') ?? list[0]
    const color = blockBackgroundOf(decisive.node)

    if (!hasBlockBackground(target, color)) patches.push({ pos, color })
  })

  return patches
}

export const applyCarriedBlockBackground = (tr: Transaction, input: CarryInput) => {
  for (const { pos, color } of planCarriedBlockBackground(tr.doc, input)) {
    tr.setNodeAttribute(pos, BLOCK_BACKGROUND_ATTRIBUTE, color)
  }
}

/**
 * resolveBlockRange を使わないのは、ブロックの先頭で終わる選択からそのブロックを外すため。
 * Tiptap のコマンドはそのブロックも変換するので、外すと元の帯が出どころから漏れる。
 * 変換されなかったブロックは自分自身に写るので、広く取っても結果は変わらない
 */
const touchedBlockRange = (doc: PMNode, { $from, $to }: Selection) => {
  const startIndex = Math.min($from.index(0), doc.childCount - 1)
  // 深さ 0 の位置（ノード選択の端）で 1 を足さないのは、すでに直後のブロックの番号を返すため
  const reached = $to.depth === 0 ? $to.index(0) : $to.index(0) + 1

  return blockRangeAt(doc, startIndex, Math.min(Math.max(reached, startIndex + 1), doc.childCount))
}

/** undefined を失敗とみなさないのは、入力ルールが成功しても undefined を返すため */
const carryBlockBackground = <R>(tr: Transaction, run: () => R): R => {
  const { doc: before, selection } = tr
  const steps = tr.steps.length
  const result = run()

  if (result === false || result === null || tr.steps.length === steps) return result

  applyCarriedBlockBackground(tr, {
    before,
    range: touchedBlockRange(before, selection),
    mapping: tr.mapping.slice(steps),
  })

  return result
}

/**
 * これらのコマンドをそのまま使わないのは、setNodeMarkup・clearNodes・setBlockType で帯を捨てるか、
 * wrapInList で入れ子に残すため。
 * ツールバー・ショートカット・ref・スラッシュ・blockCatalog の側で引き継がないのは、すべてがこれらのコマンドを通るため。
 * Tiptap が属性を写す setHeading と setParagraph を外さないのは、写すのが 1 つのブロックの中だけで、
 * 複数のブロックにまたがると写さないため。
 *
 * listKeymap の Backspace や空の項目での Enter を包まないのは、リストから抜けた段落を、
 * 段落の末尾の Enter で帯が続かないのと同じく帯なしにするため
 */
const CARRIED_COMMANDS = {
  paragraph: ['setParagraph'],
  heading: ['setHeading', 'toggleHeading'],
  bulletList: ['toggleBulletList'],
  orderedList: ['toggleOrderedList'],
} as const satisfies Record<BlockBackgroundType, ReadonlyArray<keyof RawCommands>>

type RawCommand = (...rest: never[]) => (props: CommandProps) => boolean

const carryCommand =
  (command: RawCommand): RawCommand =>
  (...rest) =>
  (props) =>
    // 空打ち（dispatch なし）で付け直さないのは、ツールバーが毎トランザクション can() で押せるかを調べるため
    props.dispatch
      ? carryBlockBackground(props.tr, () => command(...rest)(props))
      : command(...rest)(props)

const carryInputRule = (rule: InputRule) =>
  new InputRule({
    find: rule.find,
    undoable: rule.undoable,
    handler: (props) => carryBlockBackground(props.state.tr, () => rule.handler(props)),
  })

/** serializer の拡張一覧に通さないのは、schema を変えないため */
export const patchBlockBackgroundCarry = (extension: AnyExtension): AnyExtension => {
  const { name } = extension

  if (!isBlockBackgroundType(name)) return extension

  return extension.extend({
    addCommands() {
      const parent = (this.parent?.() ?? {}) as Partial<Record<string, RawCommand>>
      const carried = CARRIED_COMMANDS[name].flatMap((command) => {
        const original = parent[command]

        return original ? [[command, carryCommand(original)] as const] : []
      })

      return { ...parent, ...Object.fromEntries(carried) }
    },
    addInputRules() {
      return (this.parent?.() ?? []).map(carryInputRule)
    },
  })
}
