import { mergeAttributes } from '@tiptap/core'
import { Table } from '@tiptap/extension-table'

import { normalizeColspan } from '../../serializers/safeAttributes'

import type { DOMOutputSpec } from '@tiptap/pm/model'

// セルの colspan の上限（HTML の仕様）とは別に持つのは、正当な表で <col> を落とさない範囲の値のため
export const MAX_TABLE_COLUMNS = 1000

/**
 * 標準は1行目の colspan の合計だけ <col> を作るため、colspan 1000 のセルを並べた小さな JSON から
 * 出力が数百倍に膨らむ。colspan を削って抑えないのは、2行目以降と列数が合わなくなり、エディタが
 * 空のセルを足して表を作り変えるため。
 * 標準の renderHTML を呼んでから <col> を外さないのは、呼んだ時点で列の数だけ <col> を作るため
 */
export const SafeTable = Table.extend({
  renderHTML(props) {
    let columns = 0

    props.node.firstChild?.forEach((cell) => {
      columns += normalizeColspan(cell.attrs.colspan)
    })

    if (columns <= MAX_TABLE_COLUMNS) return this.parent!(props)

    const table: DOMOutputSpec = [
      'table',
      mergeAttributes(this.options.HTMLAttributes, props.HTMLAttributes, {
        // min-width を残すのは、列幅が無くても表が押しつぶされず、wrapper で横にスクロールできるようにするため
        style:
          (props.HTMLAttributes.style as string | undefined) ??
          `min-width: ${columns * this.options.cellMinWidth}px`,
      }),
      ['tbody', 0],
    ]

    return this.options.renderWrapper ? ['div', { class: 'tableWrapper' }, table] : table
  },
})
