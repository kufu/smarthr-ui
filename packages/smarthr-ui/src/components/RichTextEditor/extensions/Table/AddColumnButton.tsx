'use client'

import { TextSelection } from '@tiptap/pm/state'
import { TableMap, addColumn } from '@tiptap/pm/tables'
import { type FC, type MouseEvent, memo, useCallback } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { FaPlusIcon } from '../../../Icon'

import type { Editor } from '@tiptap/react'

type Props = {
  editor: Editor
  tablePos: number
  top: number
  left: number
  height: number
  thickness: number
  onFocus?: () => void
  onBlur?: () => void
}

const classNameGenerator = tv({
  slots: {
    button: [
      'smarthr-ui-RichTextEditor-AddColumnButton',
      'shr-absolute shr-z-overlap-base',
      'shr-flex shr-items-center shr-justify-center',
      'shr-border-shorthand shr-cursor-pointer shr-rounded-m shr-bg-white shr-text-base shr-text-grey shr-shadow-layer-1',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator focus-visible:shr-bg-white-darken',
    ],
  },
})

export const AddColumnButton: FC<Props> = memo(
  ({ editor, tablePos, top, left, height, thickness, onFocus, onBlur }) => {
    const { localize } = useIntl()
    const classNames = classNameGenerator()

    const label = localize({
      id: 'smarthr-ui/RichTextEditor/tableAddColumnAfter',
      defaultText: '列を右に追加',
    })

    const handleClick = useCallback(
      (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const tableNode = editor.state.doc.nodeAt(tablePos)
        if (!tableNode || tableNode.type.name !== 'table') return

        const map = TableMap.get(tableNode)
        const tableStart = tablePos + 1
        const tr = editor.state.tr
        addColumn(
          tr,
          {
            map,
            tableStart,
            table: tableNode,
            top: 0,
            bottom: map.height,
            left: map.width,
            right: map.width,
          },
          map.width,
        )
        // 追加した列の先頭行のセルにフォーカスを移す
        const newTable = tr.doc.nodeAt(tablePos)
        if (newTable) {
          const newMap = TableMap.get(newTable)
          const newColIndex = newMap.width - 1
          const firstCellOffset = newMap.map[newColIndex]
          const cellPos = tableStart + firstCellOffset + 1
          tr.setSelection(TextSelection.near(tr.doc.resolve(cellPos)))
        }
        editor.view.dispatch(tr)
        editor.commands.focus()
      },
      [editor, tablePos],
    )

    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        className={classNames.button()}
        style={{ top, left, height, width: thickness }}
        onMouseDown={(e) => e.preventDefault()}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={handleClick}
      >
        <FaPlusIcon alt="" className="shr-shrink-0" />
      </button>
    )
  },
)
