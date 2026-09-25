'use client'

import { type FC, type MouseEvent, memo, useCallback } from 'react'
import { FaPlusIcon } from 'smarthr-ui'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'

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
      'shr-absolute shr-z-0',
      'shr-flex shr-items-center shr-justify-center',
      'shr-cursor-pointer shr-rounded-full shr-border-none shr-bg-white-darken shr-text-xs shr-text-grey',
      'hover:shr-text-black',
      'focus-visible:shr-focus-indicator focus-visible:shr-bg-white-darken',
    ],
  },
})

export const AddTableAxisButton: FC<Props> = memo(
  ({ editor, tablePos, top, left, axis, length, thickness, onFocus, onBlur }) => {
    const { localize } = useIntl()
    const classNames = classNameGenerator()

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
        className={classNames.button({
          className:
            axis === 'row'
              ? 'smarthr-ui-RichTextEditor-AddRowButton'
              : 'smarthr-ui-RichTextEditor-AddColumnButton',
        })}
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
        <FaPlusIcon alt="" className="shr-shrink-0" />
      </button>
    )
  },
)
