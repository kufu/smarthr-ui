import type { Node as PMNode, ResolvedPos } from '@tiptap/pm/model'

/** doc の最上位の子の連続した並び。startIndex は含み、endIndex は含まない */
export type BlockRange = { from: number; to: number; startIndex: number; endIndex: number }

/** 'up' / 'down' は 1 つずつ、数値は元の文書での最上位の境界（0〜childCount） */
export type MoveTarget = 'up' | 'down' | number

export type MovePlan =
  /**
   * boundary は落とす先の元の文書での境界、insertAt は範囲を取り除いたあとの文書での挿入位置、
   * startIndex は移動後の先頭の番号
   */
  | { type: 'move'; boundary: number; insertAt: number; startIndex: number }
  | { type: 'limit'; edge: 'first' | 'last' }
  | { type: 'noop' }

const offsetOf = (doc: PMNode, index: number) => {
  let pos = 0

  for (let i = 0; i < index; i++) pos += doc.child(i).nodeSize

  return pos
}

export const blockRangeAt = (
  doc: PMNode,
  startIndex: number,
  endIndex = startIndex + 1,
): BlockRange => {
  const from = offsetOf(doc, startIndex)
  let to = from

  for (let i = startIndex; i < endIndex; i++) to += doc.child(i).nodeSize

  return { from, to, startIndex, endIndex }
}

const isAtBlockStart = ($pos: ResolvedPos) => $pos.pos === $pos.before(1) + $pos.depth

/**
 * 深さ 0 の位置（ノード選択の端・ギャップカーソル）は直後のブロックの番号を返すので、
 * 終わりの側だけはそのまま含まない端として使う。
 * ブロックの先頭で終わる選択もそのブロックを含めない。行を選ぶと、次の行の先頭まで選ばれやすい
 */
export const resolveBlockRange = (
  doc: PMNode,
  { $from, $to }: { $from: ResolvedPos; $to: ResolvedPos },
): BlockRange => {
  const startIndex = Math.min($from.index(0), doc.childCount - 1)
  const endIndex = $to.depth === 0 || isAtBlockStart($to) ? $to.index(0) : $to.index(0) + 1

  return blockRangeAt(doc, startIndex, Math.min(Math.max(endIndex, startIndex + 1), doc.childCount))
}

export const isCurrentRange = (doc: PMNode, range: BlockRange) => {
  if (
    !Number.isInteger(range.startIndex) ||
    !Number.isInteger(range.endIndex) ||
    range.startIndex < 0 ||
    range.startIndex >= range.endIndex ||
    range.endIndex > doc.childCount
  ) {
    return false
  }

  const current = blockRangeAt(doc, range.startIndex, range.endIndex)

  return current.from === range.from && current.to === range.to
}

export const isEmptyParagraph = (node: PMNode | null) =>
  node?.type.name === 'paragraph' && node.content.size === 0

/**
 * 末尾の空の段落より下へは動かさない。表などを末尾へ動かすと、エディタが末尾に空の段落を足し直すため、
 * 下へ押すたびに空の段落が 1 つずつ増え、端に届かなくなる
 */
export const lastBoundary = (doc: PMNode, endIndex: number) =>
  endIndex < doc.childCount && isEmptyParagraph(doc.lastChild) ? doc.childCount - 1 : doc.childCount

export const planMove = (doc: PMNode, range: BlockRange, to: MoveTarget): MovePlan => {
  if (to === 'up' && range.startIndex === 0) return { type: 'limit', edge: 'first' }

  const last = lastBoundary(doc, range.endIndex)

  if (to === 'down' && range.endIndex >= last) return { type: 'limit', edge: 'last' }

  const boundary =
    to === 'up' ? range.startIndex - 1 : to === 'down' ? range.endIndex + 1 : Math.min(to, last)

  if (
    !Number.isInteger(boundary) ||
    boundary < 0 ||
    (typeof to === 'number' && to > doc.childCount) ||
    (boundary >= range.startIndex && boundary <= range.endIndex)
  ) {
    return { type: 'noop' }
  }

  const target = offsetOf(doc, boundary)

  return boundary < range.startIndex
    ? { type: 'move', boundary, insertAt: target, startIndex: boundary }
    : {
        type: 'move',
        boundary,
        insertAt: target - (range.to - range.from),
        startIndex: boundary - (range.endIndex - range.startIndex),
      }
}

type VerticalRect = { top: number; bottom: number }

export const findBlockIndex = (rects: readonly VerticalRect[], y: number) => {
  for (let i = 0; i < rects.length - 1; i++) {
    if (y <= (rects[i].bottom + rects[i + 1].top) / 2) return i
  }

  return rects.length - 1
}

export const findBoundaryIndex = (rects: readonly VerticalRect[], y: number) => {
  const index = rects.findIndex(({ top, bottom }) => y < (top + bottom) / 2)

  return index === -1 ? rects.length : index
}
