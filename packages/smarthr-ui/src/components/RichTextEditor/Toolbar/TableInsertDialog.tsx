'use client'

import { type FC, type FormEvent, memo, useCallback, useState } from 'react'

import { useIntl } from '../../../intl'
import { ControlledFormDialog } from '../../Dialog'
import { Fieldset } from '../../Fieldset'
import { FormControl } from '../../FormControl'
import { Input } from '../../Input'
import { Cluster } from '../../Layout'

type Props = {
  onInsert: (rows: number, cols: number) => void
  onClose: () => void
}

const isValidSize = (value: string) => {
  const num = parseInt(value, 10)
  return !Number.isNaN(num) && num >= 1
}

export const TableInsertDialog: FC<Props> = memo(({ onInsert, onClose }) => {
  const { localize } = useIntl()
  const [rows, setRows] = useState('3')
  const [cols, setCols] = useState('3')
  const [error, setError] = useState('')

  const errorMessage = localize({
    id: 'smarthr-ui/RichTextEditor/tableInvalidSize',
    defaultText: '1以上の数値を入力してください',
  })

  const validate = useCallback(
    (r: string, c: string): boolean => {
      const valid = isValidSize(r) && isValidSize(c)
      setError(valid ? '' : errorMessage)
      return valid
    },
    [errorMessage],
  )

  const handleSubmit = useCallback(
    (_e: FormEvent<HTMLFormElement>, helpers: { close: () => void }) => {
      if (validate(rows, cols)) {
        onInsert(parseInt(rows, 10), parseInt(cols, 10))
        helpers.close()
      }
    },
    [rows, cols, validate, onInsert],
  )

  const titleText = localize({
    id: 'smarthr-ui/RichTextEditor/tableInsertDialogTitle',
    defaultText: 'テーブルを挿入',
  })
  const rowsLabel = localize({
    id: 'smarthr-ui/RichTextEditor/tableRowsLabel',
    defaultText: '行数',
  })
  const colsLabel = localize({
    id: 'smarthr-ui/RichTextEditor/tableColsLabel',
    defaultText: '列数',
  })
  const insertText = localize({
    id: 'smarthr-ui/RichTextEditor/tableInsertButton',
    defaultText: '挿入',
  })

  return (
    <ControlledFormDialog
      isOpen
      heading={titleText}
      actionText={insertText}
      onSubmit={handleSubmit}
      onClickClose={onClose}
      size="S"
    >
      <Fieldset
        legend={{ text: titleText, unrecommendedHide: true }}
        errorMessages={error || undefined}
        innerMargin={0.5}
      >
        <Cluster gap={1}>
          <FormControl label={rowsLabel}>
            <Input
              name="tableRows"
              type="number"
              value={rows}
              error={!!error}
              width="6em"
              min={1}
              onChange={(e) => {
                setRows(e.target.value)
                if (error) setError('')
              }}
            />
          </FormControl>
          <FormControl label={colsLabel}>
            <Input
              name="tableCols"
              type="number"
              value={cols}
              error={!!error}
              width="6em"
              min={1}
              onChange={(e) => {
                setCols(e.target.value)
                if (error) setError('')
              }}
            />
          </FormControl>
        </Cluster>
      </Fieldset>
    </ControlledFormDialog>
  )
})
