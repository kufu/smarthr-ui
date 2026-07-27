'use client'

import {
  type FC,
  type FormEvent,
  type KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { FormControl } from '../../FormControl'
import { FaTableIcon } from '../../Icon'
import { Input } from '../../Input'
import { Cluster, Stack } from '../../Layout'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'

import { ToolbarButton } from './ToolbarButton'

const classNameGenerator = tv({
  slots: {
    popup: [
      'shr-border-shorthand shr-rounded-m shr-bg-white shr-p-1 shr-shadow-layer-3',
      'shr-min-w-[12em]',
    ],
    field: 'shr-flex shr-flex-col shr-gap-0.25 shr-text-sm shr-text-black',
    error: 'shr-text-sm shr-text-danger',
  },
})

const isValidSize = (value: string) => {
  const num = parseInt(value, 10)
  return !Number.isNaN(num) && num >= 1
}

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const TableInsertDropdown: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const [rows, setRows] = useState('3')
    const [cols, setCols] = useState('3')
    const [error, setError] = useState('')
    const popupRef = useRef<HTMLDivElement>(null)
    const firstInputRef = useRef<HTMLInputElement>(null)
    const classNames = classNameGenerator()

    const errorMessage = localize({
      id: 'smarthr-ui/RichTextEditor/tableInvalidSize',
      defaultText: '1以上の数値を入力してください',
    })

    const tableLabel = localize({
      id: 'smarthr-ui/RichTextEditor/tableInsert',
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
    const cancelText = localize({
      id: 'smarthr-ui/RichTextEditor/tableCancelButton',
      defaultText: 'キャンセル',
    })

    const closePopup = useCallback(() => {
      setIsOpen(false)
      setError('')
      triggerRef.current?.focus()
    }, [setIsOpen, triggerRef])

    const handleSubmit = useCallback(
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValidSize(rows) || !isValidSize(cols)) {
          setError(errorMessage)
          return
        }
        editor
          .chain()
          .focus()
          .insertTable({
            rows: parseInt(rows, 10),
            cols: parseInt(cols, 10),
            withHeaderRow: true,
          })
          .run()
        setIsOpen(false)
        setError('')
      },
      [editor, rows, cols, errorMessage, setIsOpen],
    )

    const handlePopupKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          closePopup()
        }
      },
      [closePopup],
    )

    const handleTriggerKeyDown = useCallback(
      (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
          case 'ArrowDown':
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(true)
            break
          default:
            onKeyDownProp?.(e)
        }
      },
      [setIsOpen, onKeyDownProp],
    )

    // ポップアップ表示時に行数Inputへフォーカス
    useEffect(() => {
      if (isOpen) {
        requestAnimationFrame(() => {
          firstInputRef.current?.focus()
          firstInputRef.current?.select()
        })
      }
    }, [isOpen])

    return (
      <>
        <ToolbarButton
          ref={(el) => {
            triggerRef.current = el
            refProp?.(el)
          }}
          icon={<FaTableIcon />}
          label={tableLabel}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          onFocus={onFocusProp}
        />
        {renderDropdown(
          <div ref={popupRef} role="dialog" aria-label={tableLabel} className={classNames.popup()}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form onSubmit={handleSubmit} onKeyDown={handlePopupKeyDown}>
              <Stack gap={0.75}>
                <Cluster gap={0.75}>
                  <FormControl label={rowsLabel}>
                    <Input
                      ref={firstInputRef}
                      name="tableRows"
                      type="number"
                      value={rows}
                      width="5em"
                      min={1}
                      error={!!error}
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
                      width="5em"
                      min={1}
                      error={!!error}
                      onChange={(e) => {
                        setCols(e.target.value)
                        if (error) setError('')
                      }}
                    />
                  </FormControl>
                </Cluster>
                {error && (
                  <span role="alert" className={classNames.error()}>
                    {error}
                  </span>
                )}
                <Cluster gap={0.5} justify="flex-end">
                  <Button type="button" size="S" variant="secondary" onClick={closePopup}>
                    {cancelText}
                  </Button>
                  <Button type="submit" size="S" variant="primary">
                    {insertText}
                  </Button>
                </Cluster>
              </Stack>
            </form>
          </div>,
        )}
      </>
    )
  },
)
