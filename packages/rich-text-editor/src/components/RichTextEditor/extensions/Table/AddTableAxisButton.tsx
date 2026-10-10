'use client'

import { type FC, type MouseEvent, memo, useCallback } from 'react'
import { FaPlusIcon } from 'smarthr-ui'

import { useIntl } from '../../../../intl'
import { tv } from '../../../../libs/tv'

import { insertTableAxis } from './tableTarget'

import type { Editor } from '@tiptap/react'

type Props = {
  editor: Editor
  tablePos: number
  top: number
  left: number
  axis: 'row' | 'column'
  length: number
  thickness: number
  onFocus?: () => void
  onBlur?: () => void
}

const classNameGenerator = tv({
  slots: {
    button: [
      'shr-rte-absolute shr-rte-z-0',
      'shr-rte-flex shr-rte-items-center shr-rte-justify-center',
      'shr-rte-cursor-pointer shr-rte-rounded-full shr-rte-border-none shr-rte-bg-white-darken shr-rte-text-xs shr-rte-text-grey',
      'hover:shr-rte-text-black',
      'focus-visible:shr-rte-focus-indicator focus-visible:shr-rte-bg-white-darken',
    ],
  },
})

const CLASS_NAMES = (() => {
  const { button } = classNameGenerator()

  return {
    row: button({ className: 'smarthr-ui-RichTextEditor-AddRowButton' }),
    column: button({ className: 'smarthr-ui-RichTextEditor-AddColumnButton' }),
  }
})()

export const AddTableAxisButton: FC<Props> = memo(
  ({ editor, tablePos, top, left, axis, length, thickness, onFocus, onBlur }) => {
    const { localize } = useIntl()

    const label = localize(
      axis === 'row'
        ? {
            id: 'smarthr-ui/RichTextEditor/tableAddRowAfter',
            defaultText: '行を下に追加',
          }
        : { id: 'smarthr-ui/RichTextEditor/tableAddColumnAfter', defaultText: '列を右に追加' },
    )

    const handleClick = useCallback(
      (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        insertTableAxis(editor, axis, 'end', tablePos)
      },
      [editor, tablePos, axis],
    )

    return (
      <button
        type="button"
        title={label}
        className={CLASS_NAMES[axis]}
        style={{
          top,
          left,
          width: axis === 'row' ? length : thickness,
          height: axis === 'row' ? thickness : length,
        }}
        aria-label={label}
        onMouseDown={(e) => e.preventDefault()}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={handleClick}
      >
        <FaPlusIcon alt="" className="shr-rte-shrink-0" />
      </button>
    )
  },
)
