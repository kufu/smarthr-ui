'use client'
import { Button, FaCheckIcon, FaXmarkIcon } from 'smarthr-ui'

import { useIntl } from '../../../../intl'
import { EDITOR_BACKGROUND_COLORS } from '../../Toolbar/ColorPicker/backgroundColors'
import { normalizeHex } from '../../Toolbar/ColorPicker/normalizeHex'
import { EDITOR_COLORS } from '../../Toolbar/ColorPicker/textColors'

import { setTableCellColor } from './tableColor'
import { getSelectedCellColor } from './tableTarget'

import type { Editor } from '@tiptap/react'
export const TableColorPalette = ({
  editor,
  attribute,
  title,
  run,
}: {
  editor: Editor
  attribute: 'color' | 'backgroundColor'
  title: string
  run: (action: () => unknown) => void
}) => {
  const { localize } = useIntl()
  const current = getSelectedCellColor(editor, attribute)
  const normalizedCurrent = current === null ? null : normalizeHex(current, '')
  return (
    <div role="group" className="shr-px-1 shr-py-0.75" aria-label={title}>
      <div className="shr-mb-0.5 shr-text-sm shr-font-bold shr-text-grey">{title}</div>
      <div className="shr-grid shr-gap-0.5" style={{ gridTemplateColumns: 'repeat(6, 32px)' }}>
        {(attribute === 'color' ? EDITOR_COLORS : EDITOR_BACKGROUND_COLORS).map((color) => {
          const label = localize({ id: color.labelId, defaultText: color.defaultText })
          const selected =
            normalizedCurrent !== null && normalizedCurrent === normalizeHex(color.value, '')
          return (
            <button
              key={color.value}
              type="button"
              title={label}
              className="shr-border-shorthand shr-relative shr-flex shr-cursor-pointer shr-items-center shr-justify-center shr-rounded-m shr-p-0 group-data-[keyboard=true]/table-menu:focus:shr-focus-indicator hover:shr-shadow-outline group-data-[keyboard=false]/table-menu:focus:shr-outline-none"
              style={{
                width: 32,
                height: 32,
                backgroundColor: attribute === 'color' ? '#fff' : color.value,
                color: attribute === 'color' ? color.value : undefined,
              }}
              aria-label={label}
              aria-pressed={selected}
              onClick={() => run(() => setTableCellColor(editor, attribute, color.value))}
            >
              {attribute === 'color' && (
                <span className="shr-text-lg shr-font-bold" aria-hidden="true">
                  {'A'}
                </span>
              )}
              {selected && (
                <FaCheckIcon className="shr-absolute shr-bottom-0 shr-right-0 shr-rounded-s shr-bg-white shr-text-xs shr-text-main" />
              )}
            </button>
          )
        })}
      </div>
      <Button
        variant="text"
        size="S"
        className="shr-mt-0.5 shr-font-normal"
        onClick={() => run(() => setTableCellColor(editor, attribute, null))}
        prefix={<FaXmarkIcon />}
      >
        {localize({ id: 'smarthr-ui/RichTextEditor/resetCellColor', defaultText: '色をリセット' })}
      </Button>
    </div>
  )
}
