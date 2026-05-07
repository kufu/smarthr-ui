'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import {
  FaCheckIcon,
  FaCompressIcon,
  FaExpandIcon,
  FaMinusIcon,
  FaPlusIcon,
  FaTableColumnsIcon,
  FaTableIcon,
  FaTrashCanIcon,
} from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { useToolbarState } from '../hooks/useToolbarState'

import { TableInsertDialog } from './TableInsertDialog'
import { ToolbarButton } from './ToolbarButton'

const classNameGenerator = tv({
  slots: {
    menu: ['shr-border-shorthand shr-rounded-m shr-bg-white shr-py-0.25 shr-shadow-layer-3'],
    section: 'shr-py-0.25',
    separator: 'shr-border-t-shorthand shr-mx-0.5',
    grid: 'shr-grid shr-grid-cols-2',
    menuItem: [
      'shr-flex shr-w-full shr-cursor-pointer shr-items-center shr-gap-0.5',
      'shr-border-none shr-bg-transparent shr-px-0.75 shr-py-0.5 shr-text-left shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-cursor-not-allowed disabled:shr-text-disabled',
    ],
    menuItemIcon: 'shr-shrink-0 shr-text-base',
    checkboxItem: [
      'shr-flex shr-w-full shr-cursor-pointer shr-items-center shr-gap-0.5',
      'shr-border-none shr-bg-transparent shr-px-0.75 shr-py-0.5 shr-text-left shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    checkIcon: 'shr-shrink-0 shr-text-base shr-text-main',
    checkPlaceholder: 'shr-inline-block shr-w-[1em] shr-shrink-0 shr-text-base',
  },
})

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const TableDropdown: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const [showInsertDialog, setShowInsertDialog] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const classNames = classNameGenerator()

    const handleTriggerClick = useCallback(() => {
      if (state.isInTable) {
        setIsOpen((prev) => !prev)
      } else {
        setShowInsertDialog(true)
      }
    }, [state.isInTable, setIsOpen])

    const handleTriggerKeyDown = useCallback(
      (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault()
            e.stopPropagation()
            handleTriggerClick()
            if (state.isInTable) {
              requestAnimationFrame(() => {
                menuRef.current?.querySelector<HTMLElement>('button')?.focus()
              })
            }
            break
          case 'ArrowDown':
            if (state.isInTable) {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(true)
              requestAnimationFrame(() => {
                menuRef.current?.querySelector<HTMLElement>('button')?.focus()
              })
            }
            break
          default:
            onKeyDownProp?.(e)
        }
      },
      [handleTriggerClick, state.isInTable, onKeyDownProp, setIsOpen],
    )

    const handleMenuKeyDown = useCallback(
      (e: KeyboardEvent) => {
        const items = menuRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled)')
        if (!items) return
        const currentIndex = Array.from(items).indexOf(e.currentTarget as HTMLElement)

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            e.stopPropagation()
            items[(currentIndex + 1) % items.length]?.focus()
            break
          case 'ArrowUp':
            e.preventDefault()
            e.stopPropagation()
            items[(currentIndex - 1 + items.length) % items.length]?.focus()
            break
          case 'Home':
            e.preventDefault()
            e.stopPropagation()
            items[0]?.focus()
            break
          case 'End':
            e.preventDefault()
            e.stopPropagation()
            items[items.length - 1]?.focus()
            break
          case 'Escape':
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(false)
            triggerRef.current?.focus()
            break
          case 'Tab':
            setIsOpen(false)
            break
        }
      },
      [setIsOpen, triggerRef],
    )

    const runCommand = useCallback(
      (command: string) => {
        const chain = editor.chain().focus() as unknown as Record<
          string,
          (() => { run: () => boolean }) | undefined
        >
        chain[command]?.().run()
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [editor, setIsOpen, triggerRef],
    )

    const handleInsert = useCallback(
      (rows: number, cols: number) => {
        editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
        setShowInsertDialog(false)
      },
      [editor],
    )

    const tableLabel = localize({
      id: 'smarthr-ui/RichTextEditor/table',
      defaultText: 'テーブル',
    })

    return (
      <>
        <ToolbarButton
          ref={(el) => {
            triggerRef.current = el
            refProp?.(el)
          }}
          icon={<FaTableIcon />}
          label={tableLabel}
          active={state.isInTable}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-expanded={state.isInTable ? isOpen : undefined}
          aria-haspopup={state.isInTable ? 'menu' : undefined}
          onKeyDown={handleTriggerKeyDown}
          onFocus={onFocusProp}
          onClick={handleTriggerClick}
        />
        {state.isInTable &&
          renderDropdown(
            <div ref={menuRef} role="menu" aria-label={tableLabel} className={classNames.menu()}>
              {/* ヘッダー設定 */}
              <div className={classNames.section()}>
                <button
                  type="button"
                  aria-pressed={state.hasHeaderRow}
                  className={classNames.checkboxItem()}
                  onClick={() => runCommand('toggleHeaderRow')}
                  onKeyDown={handleMenuKeyDown}
                >
                  {state.hasHeaderRow ? (
                    <FaCheckIcon className={classNames.checkIcon()} />
                  ) : (
                    <span className={classNames.checkPlaceholder()} />
                  )}
                  {localize({
                    id: 'smarthr-ui/RichTextEditor/tableToggleHeaderRow',
                    defaultText: '最初の行をヘッダーにする',
                  })}
                </button>
                <button
                  type="button"
                  aria-pressed={state.hasHeaderColumn}
                  className={classNames.checkboxItem()}
                  onClick={() => runCommand('toggleHeaderColumn')}
                  onKeyDown={handleMenuKeyDown}
                >
                  {state.hasHeaderColumn ? (
                    <FaCheckIcon className={classNames.checkIcon()} />
                  ) : (
                    <span className={classNames.checkPlaceholder()} />
                  )}
                  {localize({
                    id: 'smarthr-ui/RichTextEditor/tableToggleHeaderColumn',
                    defaultText: '最初の列をヘッダーにする',
                  })}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={!state.canToggleHeaderCell}
                  className={classNames.menuItem()}
                  onClick={() => runCommand('toggleHeaderCell')}
                  onKeyDown={handleMenuKeyDown}
                >
                  <FaTableColumnsIcon className={classNames.menuItemIcon()} />
                  {localize({
                    id: 'smarthr-ui/RichTextEditor/tableToggleHeaderCell',
                    defaultText: 'ヘッダーセルの切り替え',
                  })}
                </button>
              </div>

              <hr className={classNames.separator()} />

              {/* 行列操作 */}
              <div className={classNames.section()}>
                <div className={classNames.grid()}>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!state.canAddColumnAfter}
                    className={classNames.menuItem()}
                    onClick={() => runCommand('addColumnAfter')}
                    onKeyDown={handleMenuKeyDown}
                  >
                    <FaPlusIcon className={classNames.menuItemIcon()} />
                    {localize({
                      id: 'smarthr-ui/RichTextEditor/tableAddColumnAfter',
                      defaultText: '列を右に追加',
                    })}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!state.canAddRowBefore}
                    className={classNames.menuItem()}
                    onClick={() => runCommand('addRowBefore')}
                    onKeyDown={handleMenuKeyDown}
                  >
                    <FaPlusIcon className={classNames.menuItemIcon()} />
                    {localize({
                      id: 'smarthr-ui/RichTextEditor/tableAddRowBefore',
                      defaultText: '行を上に追加',
                    })}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!state.canAddColumnBefore}
                    className={classNames.menuItem()}
                    onClick={() => runCommand('addColumnBefore')}
                    onKeyDown={handleMenuKeyDown}
                  >
                    <FaPlusIcon className={classNames.menuItemIcon()} />
                    {localize({
                      id: 'smarthr-ui/RichTextEditor/tableAddColumnBefore',
                      defaultText: '列を左に追加',
                    })}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!state.canAddRowAfter}
                    className={classNames.menuItem()}
                    onClick={() => runCommand('addRowAfter')}
                    onKeyDown={handleMenuKeyDown}
                  >
                    <FaPlusIcon className={classNames.menuItemIcon()} />
                    {localize({
                      id: 'smarthr-ui/RichTextEditor/tableAddRowAfter',
                      defaultText: '行を下に追加',
                    })}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!state.canDeleteColumn}
                    className={classNames.menuItem()}
                    onClick={() => runCommand('deleteColumn')}
                    onKeyDown={handleMenuKeyDown}
                  >
                    <FaMinusIcon className={classNames.menuItemIcon()} />
                    {localize({
                      id: 'smarthr-ui/RichTextEditor/tableDeleteColumn',
                      defaultText: '列を削除',
                    })}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!state.canDeleteRow}
                    className={classNames.menuItem()}
                    onClick={() => runCommand('deleteRow')}
                    onKeyDown={handleMenuKeyDown}
                  >
                    <FaMinusIcon className={classNames.menuItemIcon()} />
                    {localize({
                      id: 'smarthr-ui/RichTextEditor/tableDeleteRow',
                      defaultText: '行を削除',
                    })}
                  </button>
                </div>
              </div>

              <hr className={classNames.separator()} />

              {/* セル結合・分割 */}
              <div className={classNames.section()}>
                <div className={classNames.grid()}>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!state.canMergeCells}
                    className={classNames.menuItem()}
                    onClick={() => runCommand('mergeCells')}
                    onKeyDown={handleMenuKeyDown}
                  >
                    <FaCompressIcon className={classNames.menuItemIcon()} />
                    {localize({
                      id: 'smarthr-ui/RichTextEditor/tableMergeCells',
                      defaultText: 'セルを結合',
                    })}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!state.canSplitCell}
                    className={classNames.menuItem()}
                    onClick={() => runCommand('splitCell')}
                    onKeyDown={handleMenuKeyDown}
                  >
                    <FaExpandIcon className={classNames.menuItemIcon()} />
                    {localize({
                      id: 'smarthr-ui/RichTextEditor/tableSplitCell',
                      defaultText: 'セルを分割',
                    })}
                  </button>
                </div>
              </div>

              <hr className={classNames.separator()} />

              {/* テーブル削除 */}
              <div className={classNames.section()}>
                <button
                  type="button"
                  role="menuitem"
                  disabled={!state.canDeleteTable}
                  className={classNames.menuItem()}
                  onClick={() => runCommand('deleteTable')}
                  onKeyDown={handleMenuKeyDown}
                >
                  <FaTrashCanIcon className={classNames.menuItemIcon()} />
                  {localize({
                    id: 'smarthr-ui/RichTextEditor/tableDeleteTable',
                    defaultText: 'テーブルを削除',
                  })}
                </button>
              </div>
            </div>,
          )}
        {showInsertDialog && (
          <TableInsertDialog onInsert={handleInsert} onClose={() => setShowInsertDialog(false)} />
        )}
      </>
    )
  },
)
