import { fromString } from '@tiptap/core'
import { TableCell, TableHeader } from '@tiptap/extension-table'

import {
  fitWidthsToColspan,
  isSafeColwidth,
  normalizeColspan,
  normalizeRowspan,
  parseNumericAttr,
} from '../../serializers/safeAttributes'

import { MAX_TABLE_COLUMNS } from './SafeTable'

import type { Attributes, Node } from '@tiptap/core'

// セルごとに表全体を数え直すと、大きな表の貼り付けでセル数の2乗の手間になるため、表ごとに1回だけ数える。
// 1回の読み込みの間だけ残すのは、同じ DOM を書き換えて読み直したときに古い幅を返さないため。
// 表ごとに消す予約を入れないのは、予約が表の DOM をつかまえ、続けて読み込むと解放されないため
let layouts = new WeakMap<Element, Map<Element, number[] | null>>()
let isResetScheduled = false

const scheduleReset = () => {
  if (!isResetScheduled) {
    isResetScheduled = true
    queueMicrotask(() => {
      layouts = new WeakMap()
      isResetScheduled = false
    })
  }
}

const TABLE_SECTION_TAGS = ['THEAD', 'TBODY', 'TFOOT']

// children を配列にしないのは、jsdom などでは要素数の2乗の時間がかかり、セルの多い行で固まるため
function* childrenByTag(parent: Element, tags: readonly string[]) {
  for (let child = parent.firstElementChild; child; child = child.nextElementSibling) {
    if (tags.includes(child.tagName)) yield child
  }
}

// table.rows・row.cells を使わないのは、サーバーの happy-dom が入れ子の表の行やセルまで含め、
// ブラウザは thead・tfoot を並べ替えるため。ProseMirror と同じく、文書の順に直下の要素だけをたどる
function* rowsOf(table: Element) {
  for (let child = table.firstElementChild; child; child = child.nextElementSibling) {
    if (child.tagName === 'TR') yield child
    else if (TABLE_SECTION_TAGS.includes(child.tagName)) yield* childrenByTag(child, ['TR'])
  }
}

// parseInt で読まないのは、割合（50%）や相対幅（85*）をピクセルとして読んでしまうため
const parsePixelWidth = (value: string | null | undefined): number | null => {
  const width = parseNumericAttr(value?.trim().replace(/px$/i, ''))

  return width ? Math.round(width) || null : null
}

// Number で読まないのは、モデルの属性と同じ読み方にしないと " 2" のような値で列の数え方がずれるため
const spanOf = (element: Element, name: 'colspan' | 'rowspan') =>
  fromString(element.getAttribute(name) ?? '1')

function* columnsOf(table: Element) {
  for (const colgroup of childrenByTag(table, ['COLGROUP'])) {
    const cols = Array.from(childrenByTag(colgroup, ['COL']))
    // <col> の無い colgroup を読み飛ばさないのは、LibreOffice Calc が colgroup 自身の width と span で列幅を書くため
    yield* cols.length > 0 ? cols : [colgroup]
  }
}

const readColumnWidths = (table: Element) => {
  const widths: Array<number | null> = []

  for (const col of columnsOf(table)) {
    // 表の列数で打ち切らないと、span の大きな <col> を並べた小さな HTML から巨大な配列を作れる
    if (widths.length >= MAX_TABLE_COLUMNS) break

    const width = parsePixelWidth(col.getAttribute('width'))
    // fromString で読まないのは、span はモデルの属性ではなく、ブラウザは " 2" も 2 列と読むため
    const span = Math.min(
      normalizeColspan(parseInt(col.getAttribute('span') ?? '1', 10)),
      MAX_TABLE_COLUMNS - widths.length,
    )

    for (let i = 0; i < span; i += 1) widths.push(width)
  }

  return widths
}

const measureLayout = (table: Element): Map<Element, number[] | null> => {
  const cellWidths = new Map<Element, number[] | null>()
  const columnWidths = readColumnWidths(table)

  if (columnWidths.every((width) => width === null)) return cellWidths

  const occupiedUntil: number[] = []
  const rows = Array.from(rowsOf(table))

  rows.forEach((row, rowIndex) => {
    let column = 0

    // 幅の分かる列より右は数えないのは、colspan の大きなセルを並べた表で計算が colspan の合計に比例するため
    for (const cell of childrenByTag(row, ['TD', 'TH'])) {
      while ((occupiedUntil[column] ?? 0) > rowIndex) column += 1

      if (column >= columnWidths.length) break

      const end = column + normalizeColspan(spanOf(cell, 'colspan'))
      const rowspan = Math.min(normalizeRowspan(spanOf(cell, 'rowspan')), rows.length - rowIndex)
      const widths = columnWidths.slice(column, end)

      cellWidths.set(
        cell,
        fitWidthsToColspan(
          widths.map((width) => width ?? 0),
          end - column,
        ),
      )

      for (let i = column; i < Math.min(end, columnWidths.length); i += 1) {
        occupiedUntil[i] = rowIndex + rowspan
      }

      column = end
    }
  })

  return cellWidths
}

/**
 * 標準は行の中で何番目のセルかで <col> を1つだけ選ぶため、横や縦の結合より後ろのセルが別の列の幅を受け取り、
 * 結合したセルは1列分しか読めない。スプレッドシートから貼り付けた表の列幅がずれる
 */
const parseCellColwidth = (element: HTMLElement): number[] | null => {
  // 0 を不正な値として弾かないのは、このエディタが幅未指定の列を 0 として書き出すため
  const ownWidths = element
    .getAttribute('colwidth')
    ?.split(',')
    .map((width) => parseNumericAttr(width.trim()))

  const fitted = isSafeColwidth(ownWidths)
    ? fitWidthsToColspan(
        ownWidths.map((width) => Math.round(width)),
        normalizeColspan(spanOf(element, 'colspan')),
      )
    : null

  if (fitted) return fitted

  const table = element.closest('table')

  if (!table) return null

  let cellWidths = layouts.get(table)

  if (!cellWidths) {
    cellWidths = measureLayout(table)
    layouts.set(table, cellWidths)
    scheduleReset()
  }

  return cellWidths.get(element) ?? null
}

const withColgroupWidth = <T extends Node>(extension: T): T =>
  extension.extend({
    addAttributes() {
      const parent: Attributes = this.parent?.() ?? {}

      return {
        ...parent,
        colwidth: { ...parent.colwidth, parseHTML: parseCellColwidth },
      }
    },
  }) as T

export const SafeTableCell = withColgroupWidth(TableCell)
export const SafeTableHeader = withColgroupWidth(TableHeader)
