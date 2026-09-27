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
import { Button, Cluster, FaTableIcon, FormControl, Input, Stack } from 'smarthr-ui'

import { useIntl } from '../../../intl'
import { tv } from '../../../libs/tv'
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

// 桁を打ち間違えると数万行の transaction でタブが固まるため、上限を設ける。
// 動作は1万セルでも問題ないが、空のセルも属性を持つため 100×100 で JSON が約2MBになる。
// 列は約11列で横スクロールになるので、行より小さくして1回の挿入のデータ量を抑える
const MAX_ROWS = 100
const MAX_COLS = 20

// parseInt は '1.5' を 1 と読むため、小数が黙って切り捨てられる
const isValidSize = (value: string, max: number) => {
  const num = Number(value)
  return Number.isInteger(num) && num >= 1 && num <= max
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

    const errorMessage = localize(
      {
        id: 'smarthr-ui/RichTextEditor/tableInvalidSize',
        defaultText: '行数は1〜{maxRows}、列数は1〜{maxCols}の整数を入力してください',
      },
      { maxRows: MAX_ROWS, maxCols: MAX_COLS },
    )

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

    const closePopup = useCallback(() => {
      setIsOpen(false)
      setError('')
      triggerRef.current?.focus()
    }, [setIsOpen, triggerRef])

    const handleSubmit = useCallback(
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isValidSize(rows, MAX_ROWS) || !isValidSize(cols, MAX_COLS)) {
          setError(errorMessage)
          return
        }
        editor
          .chain()
          .focus()
          .insertTable({
            rows: Number(rows),
            cols: Number(cols),
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
          disabled={disabled}
          tabIndex={tabIndex}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          onFocus={onFocusProp}
          icon={<FaTableIcon />}
          label={tableLabel}
        />
        {renderDropdown(
          <div ref={popupRef} role="dialog" className={classNames.popup()} aria-label={tableLabel}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form noValidate onSubmit={handleSubmit} onKeyDown={handlePopupKeyDown}>
              <Stack gap={0.75}>
                <Cluster gap={0.75}>
                  <FormControl label={rowsLabel}>
                    <Input
                      ref={firstInputRef}
                      type="number"
                      name="tableRows"
                      value={rows}
                      min={1}
                      max={MAX_ROWS}
                      error={!!error}
                      width="5em"
                      onChange={(e) => {
                        setRows(e.target.value)
                        if (error) setError('')
                      }}
                    />
                  </FormControl>
                  <FormControl label={colsLabel}>
                    <Input
                      type="number"
                      name="tableCols"
                      value={cols}
                      min={1}
                      max={MAX_COLS}
                      error={!!error}
                      width="5em"
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
                <Cluster justify="flex-end">
                  <Button type="submit" variant="primary" size="S">
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
