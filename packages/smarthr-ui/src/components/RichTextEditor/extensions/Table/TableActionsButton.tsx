'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useEffect, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import {
  FaCheckIcon,
  FaCompressIcon,
  FaEllipsisIcon,
  FaExpandIcon,
  FaMinusIcon,
  FaPlusIcon,
  FaTableColumnsIcon,
  FaTrashCanIcon,
} from '../../../Icon'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'
import { useToolbarState } from '../../hooks/useToolbarState'

import { useTableActions } from './useTableActions'

import type { Editor } from '@tiptap/react'

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-RichTextEditor-TableActionsButton',
      'shr-absolute shr-z-overlap-base',
      'shr-inline-flex shr-items-center shr-justify-center',
      'shr-border-shorthand shr-h-1.5 shr-w-1.5 shr-cursor-pointer shr-rounded-m shr-bg-white shr-text-sm shr-text-black shr-shadow-layer-1',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    menu: ['shr-border-shorthand shr-rounded-m shr-bg-white shr-py-0.25 shr-shadow-layer-3'],
    section: 'shr-py-0.25',
    separator: 'shr-border-t-shorthand shr-mx-0.5',
    grid: 'shr-grid shr-grid-cols-2',
    menuItem: [
      'shr-flex shr-w-full shr-cursor-pointer shr-items-center shr-gap-0.5',
      'shr-border-none shr-bg-transparent shr-px-0.75 shr-py-0.5 shr-text-left shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-cursor-not-allowed disabled:shr-text-disabled disabled:hover:shr-bg-transparent',
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
  editor: Editor
  top: number
  left: number
}

export const TableActionsButton: FC<Props> = memo(({ editor, top, left }) => {
  const { localize } = useIntl()
  const state = useToolbarState(editor)
  const actions = useTableActions(editor)
  const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
  const menuRef = useRef<HTMLDivElement>(null)
  const classNames = classNameGenerator()

  const openMenu = useCallback(
    (focusFirst = true) => {
      setIsOpen(true)
      if (focusFirst) {
        requestAnimationFrame(() => {
          menuRef.current?.querySelector<HTMLElement>('button:not(:disabled)')?.focus()
        })
      }
    },
    [setIsOpen],
  )

  // ショートカット（Alt+Enter / Shift+F10）からメニューを開けるよう storage にハンドラを登録
  useEffect(() => {
    if (!editor.storage.table) return
    const handler = () => {
      triggerRef.current?.focus()
      openMenu(true)
    }
    editor.storage.table.openActionsMenu = handler
    return () => {
      if (editor.storage.table?.openActionsMenu === handler) {
        editor.storage.table.openActionsMenu = null
      }
    }
  }, [editor, openMenu, triggerRef])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [setIsOpen, triggerRef])

  const runAndClose = useCallback(
    (fn: () => void) => {
      fn()
      closeMenu()
    },
    [closeMenu],
  )

  const handleTriggerKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
          e.preventDefault()
          e.stopPropagation()
          openMenu(true)
          break
        case 'ArrowUp':
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
          requestAnimationFrame(() => {
            const items = menuRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled)')
            items?.[items.length - 1]?.focus()
          })
          break
      }
    },
    [openMenu, setIsOpen],
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
          closeMenu()
          break
        case 'Tab':
          setIsOpen(false)
          break
      }
    },
    [closeMenu, setIsOpen],
  )

  const triggerLabel = localize({
    id: 'smarthr-ui/RichTextEditor/tableActions',
    defaultText: '表の操作',
  })

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-keyshortcuts="Alt+Enter Shift+F10"
        className={classNames.trigger()}
        style={{ top, left }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => (isOpen ? closeMenu() : openMenu(false))}
        onKeyDown={handleTriggerKeyDown}
      >
        <FaEllipsisIcon alt="" />
      </button>
      {renderDropdown(
        <div ref={menuRef} role="menu" aria-label={triggerLabel} className={classNames.menu()}>
          {/* ヘッダー設定 */}
          <div className={classNames.section()}>
            {/*
              WAI-ARIA仕様で role="menu" 内のトグル項目は menuitemcheckbox + aria-checked
              を使う必要があるため、smarthr-uiの button+role 禁止規約を例外的に許容する。
            */}
            {/* eslint-disable-next-line smarthr/best-practice-for-interactive-element */}
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={state.hasHeaderRow}
              className={classNames.checkboxItem()}
              onClick={() => runAndClose(actions.toggleHeaderRow)}
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
            {/* eslint-disable-next-line smarthr/best-practice-for-interactive-element */}
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={state.hasHeaderColumn}
              className={classNames.checkboxItem()}
              onClick={() => runAndClose(actions.toggleHeaderColumn)}
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
              onClick={() => runAndClose(actions.toggleHeaderCell)}
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
                onClick={() => runAndClose(actions.addColumnAfter)}
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
                onClick={() => runAndClose(actions.addRowBefore)}
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
                onClick={() => runAndClose(actions.addColumnBefore)}
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
                onClick={() => runAndClose(actions.addRowAfter)}
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
                onClick={() => runAndClose(actions.deleteColumn)}
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
                onClick={() => runAndClose(actions.deleteRow)}
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
                onClick={() => runAndClose(actions.mergeCells)}
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
                onClick={() => runAndClose(actions.splitCell)}
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
              onClick={() => runAndClose(actions.deleteTable)}
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
    </>
  )
})
