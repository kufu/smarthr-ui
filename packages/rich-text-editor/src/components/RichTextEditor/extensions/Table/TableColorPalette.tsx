'use client'
import { Button, FaXmarkIcon } from 'smarthr-ui'

import { useIntl } from '../../../../intl'
import { normalizeHex } from '../../../../libs/normalizeHex'
import { ColorSwatch } from '../../Toolbar/ColorPicker/ColorSwatch'
import { EDITOR_BACKGROUND_COLORS } from '../../Toolbar/ColorPicker/backgroundColors'
import { EDITOR_COLORS } from '../../Toolbar/ColorPicker/textColors'

import { setTableCellColor } from './tableColor'
import { getSelectedCellColor } from './tableTarget'

import type { Editor } from '@tiptap/react'
export const TableColorPalette = ({
  editor,
  attribute,
  title,
  handleRun,
}: {
  editor: Editor
  attribute: 'color' | 'backgroundColor'
  title: string
  handleRun: (action: () => unknown) => void
}) => {
  const { localize } = useIntl()
  const current = getSelectedCellColor(editor, attribute)
  const normalizedCurrent = current === null ? null : normalizeHex(current, '')
  return (
    <div role="group" className="shr-rte-px-1 shr-rte-py-0.75" aria-label={title}>
      <div className="shr-rte-mb-0.5 shr-rte-text-sm shr-rte-font-bold shr-rte-text-grey">
        {title}
      </div>
      <div
        className="shr-rte-grid shr-rte-gap-0.5"
        style={{ gridTemplateColumns: 'repeat(6, 32px)' }}
      >
        {(attribute === 'color' ? EDITOR_COLORS : EDITOR_BACKGROUND_COLORS).map((color) => {
          const label = localize({ id: color.labelId, defaultText: color.defaultText })
          const selected =
            normalizedCurrent !== null && normalizedCurrent === normalizeHex(color.value, '')
          return (
            <ColorSwatch
              key={color.value}
              selected={selected}
              appearance={attribute}
              color={color.value}
              className="group-data-[keyboard=true]/table-menu:focus:shr-rte-focus-indicator group-data-[keyboard=false]/table-menu:focus:shr-rte-outline-none"
              handleClick={() => handleRun(() => setTableCellColor(editor, attribute, color.value))}
              label={label}
            />
          )
        })}
      </div>
      <Button
        variant="text"
        size="S"
        className="shr-rte-mt-0.5"
        onClick={() => handleRun(() => setTableCellColor(editor, attribute, null))}
        prefix={<FaXmarkIcon />}
      >
        {localize({ id: 'smarthr-ui/RichTextEditor/resetCellColor', defaultText: '色をリセット' })}
      </Button>
    </div>
  )
}
