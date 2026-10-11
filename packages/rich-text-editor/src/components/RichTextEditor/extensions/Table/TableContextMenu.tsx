'use client'

import {
  type CSSProperties,
  type KeyboardEvent,
  type MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FaArrowLeftIcon, FaEllipsisIcon } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { findSwatchFocusTarget, isPlainArrowKey } from '../../Toolbar/ColorPicker/swatchFocusTarget'
import { ToolbarTooltip } from '../../Toolbar/ToolbarTooltip'
import { toAriaKeyShortcuts } from '../../Toolbar/shortcutKeys'
import { useIsApplePlatform } from '../../hooks/useIsApplePlatform'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'

import { TableColorPalette } from './TableColorPalette'
import { TableMenuActions } from './TableMenuActions'
import { TableMenuItemButton } from './TableMenuItemButton'
import { TABLE_SHORTCUTS } from './tableShortcuts'
import {
  focusTableCell,
  getTableTarget,
  runTableAction,
  selectTableCell,
  selectTableTarget,
} from './tableTarget'

import type { TableScope } from './tableTarget'
import type { RichTextFeature } from '../../types'
import type { Transaction } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/react'

/**
 * 表・行のハンドルは編集領域の左端、セルのハンドルはセルの右端にあるため、
 * 中央揃えのままだとツールチップが編集領域の外へはみ出す。内側へ向けて伸ばす。
 */
const TOOLTIP_ALIGN = {
  table: 'start',
  row: 'start',
  column: 'center',
  cell: 'end',
} as const

const LABEL_MESSAGES = {
  table: { id: 'smarthr-ui/RichTextEditor/tableActions', defaultText: '表の操作' },
  row: { id: 'smarthr-ui/RichTextEditor/rowActions', defaultText: '行の操作' },
  column: { id: 'smarthr-ui/RichTextEditor/columnActions', defaultText: '列の操作' },
  cell: { id: 'smarthr-ui/RichTextEditor/cellActions', defaultText: 'セルの操作' },
} as const

type Props = {
  features: readonly RichTextFeature[]
  openMenuRef?: MutableRefObject<((pos?: number) => void) | null>
  dismissMenuRef?: MutableRefObject<(() => void) | null>
  handleTargetLock: (scope: TableScope, pos: number | null) => void
  editor: Editor
  cellPos: number
  scope: TableScope
  style: CSSProperties
}

const buttonClass =
  'shr-rte-border-none shr-rte-rounded-full shr-rte-bg-white-darken shr-rte-text-grey shr-rte-cursor-pointer hover:shr-rte-text-black aria-expanded:shr-rte-bg-main aria-expanded:shr-rte-text-white focus-visible:shr-rte-focus-indicator'

export const TableContextMenu = ({
  editor,
  cellPos,
  scope,
  style,
  features,
  openMenuRef,
  dismissMenuRef,
  handleTargetLock,
}: Props) => {
  const { localize } = useIntl()
  const isApple = useIsApplePlatform()
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [showColors, setShowColors] = useState(false)
  // 列のハンドルは矩形が列幅そのものなので、既定の左端揃えでは選択中の列が隠れる
  const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown({
    layoutKey: showColors,
    avoidTrigger: scope === 'column',
  })
  const colorTriggerRef = useRef<HTMLButtonElement>(null)
  const returnToTrigger = useRef(false)
  const focusFrame = useRef<number | null>(null)
  const restoreFrame = useRef<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuCellPos, setMenuCellPos] = useState(cellPos)
  const returnPos = useRef<number | undefined>(cellPos)
  const target = getTableTarget(editor, isOpen ? menuCellPos : cellPos)

  const latest = useLatest({
    cellPos,
    scope,
    showColors,
    openMenuRef,
    dismissMenuRef,
    handleTargetLock,
    triggerRef,
    keyboardNavigation,
  })

  const functions = useMemo(() => {
    const cancelFocus = () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
      focusFrame.current = null
    }
    const cancelRestoreFocus = () => {
      if (restoreFrame.current !== null) cancelAnimationFrame(restoreFrame.current)
      restoreFrame.current = null
    }
    const scheduleFocus = (focus: () => void) => {
      cancelFocus()
      focusFrame.current = requestAnimationFrame(() => {
        focusFrame.current = null
        focus()
      })
    }
    const close = (restoreTrigger = false) => {
      cancelFocus()
      cancelRestoreFocus()
      setIsOpen(false)
      if (restoreTrigger) latest.triggerRef.current?.focus({ preventScroll: true })
      else focusTableCell(editor, returnPos.current)
    }
    const changeColors = (show: boolean) => {
      setShowColors(show)
      scheduleFocus(() => {
        if (show)
          menuRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
        else colorTriggerRef.current?.focus()
      })
    }

    // transaction の中で同期的にセルへ戻す方式は採らない。dispatch が入れ子になるうえ、メニュー自身の
    // 操作では直後の close() もセルへ戻すため二重になる。予約にしておけば close() が取り消す。
    // focusFrame と分けてアンマウントでは取り消さないのは、キャレットが表の外へ出ると操作ボタンごと
    // アンマウントされるため
    const scheduleRestoreFocus = () => {
      cancelRestoreFocus()
      restoreFrame.current = requestAnimationFrame(() => {
        restoreFrame.current = null
        // メニューが外れたあと（body）だけに限る方式は採らない。React の外の変更では再描画が
        // 別タスクになり、メニューが外れる前にここへ来ることがある
        const { activeElement } = document
        if (
          editor.isDestroyed ||
          !(activeElement === document.body || menuRef.current?.contains(activeElement))
        )
          return
        const trigger = latest.triggerRef.current
        if (returnToTrigger.current && trigger?.isConnected) {
          trigger.focus({ preventScroll: true })
        } else {
          // focusTableCell は使わない。Tiptap の focus がさらに次のフレームへ遅らせるため、
          // その間に移されたフォーカスを奪う
          selectTableCell(editor, returnPos.current)
          editor.view.focus()
        }
      })
    }

    const dismiss = (restoreFocus = true) => {
      cancelFocus()
      if (restoreFocus && menuRef.current?.contains(document.activeElement)) scheduleRestoreFocus()
      setIsOpen(false)
    }

    return {
      cancelFocus,
      dismiss,
      // キーボードで操作していないときは本文へ戻さない。タッチ端末ではソフトキーボードが出て、
      // セルの位置へスクロールし直されるため
      dismissHidden: () => dismiss(latest.keyboardNavigation),
      open: (requestedPos = latest.cellPos, last = false, fromTrigger = false, keyboard = true) => {
        // 文書が変わってから再描画されるまでの間に押されると、位置がセルの外や別のセルの中を指す
        const pos = getTableTarget(editor, requestedPos)?.pos

        if (pos !== undefined) {
          cancelRestoreFocus()
          setKeyboardNavigation(keyboard)
          returnToTrigger.current = fromTrigger
          returnPos.current = pos
          setMenuCellPos(pos)
          latest.handleTargetLock(latest.scope, pos)
          selectTableTarget(editor, pos, latest.scope)
          setShowColors(false)
          setIsOpen(true)
          scheduleFocus(() => {
            const buttons =
              menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
            buttons?.[last ? buttons.length - 1 : 0]?.focus()
          })
        }
      },
      close,
      handleRun: (action: () => unknown) => {
        runTableAction(editor, action)
        close()
      },
      handleChangeColors: changeColors,
      handleDelegateMenuKeyDown: (delegateEvent: KeyboardEvent<HTMLDivElement>) => {
        const { key } = delegateEvent
        if (delegateEvent.key === 'Tab') {
          const buttons = Array.from(
            menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [],
          )
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
          if (
            (!delegateEvent.shiftKey && index === buttons.length - 1) ||
            (delegateEvent.shiftKey && index === 0)
          ) {
            delegateEvent.preventDefault()
            // 外枠（useToolbarDropdown）はトリガーへ戻すが、表のメニューはセルへ戻す
            delegateEvent.stopPropagation()
            close()
          }
        }
        const swatch = key.startsWith('Arrow')
          ? (delegateEvent.target as HTMLElement).closest<HTMLElement>('[data-color-swatch]')
          : null
        if (swatch) {
          if (!isPlainArrowKey(delegateEvent)) return
          const groupSwatches = Array.from(
            swatch
              .closest('[role="group"]')
              ?.querySelectorAll<HTMLElement>('[data-color-swatch]') ?? [],
          )
          let swatchTarget = findSwatchFocusTarget(groupSwatches, swatch, key)
          if (!swatchTarget && (key === 'ArrowDown' || key === 'ArrowUp')) {
            const buttons = Array.from(
              menuRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled)') ?? [],
            )
            swatchTarget =
              key === 'ArrowDown'
                ? buttons[
                    (buttons.indexOf(groupSwatches[groupSwatches.length - 1]) + 1) % buttons.length
                  ]
                : buttons[(buttons.indexOf(groupSwatches[0]) - 1 + buttons.length) % buttons.length]
          }
          if (swatchTarget) {
            delegateEvent.preventDefault()
            delegateEvent.stopPropagation()
            swatchTarget.focus()
            return
          }
          if (key !== 'ArrowLeft') {
            delegateEvent.preventDefault()
            delegateEvent.stopPropagation()
            return
          }
        }
        if (latest.showColors && ['Escape', 'ArrowLeft'].includes(delegateEvent.key)) {
          delegateEvent.preventDefault()
          delegateEvent.stopPropagation()
          changeColors(false)
          return
        }
        if (delegateEvent.key === 'Escape') {
          delegateEvent.preventDefault()
          delegateEvent.stopPropagation()
          close(returnToTrigger.current)
        }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(delegateEvent.key)) {
          delegateEvent.preventDefault()
          const buttons = Array.from(
            menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [],
          )
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
          buttons[
            delegateEvent.key === 'Home'
              ? 0
              : delegateEvent.key === 'End'
                ? buttons.length - 1
                : (index + (delegateEvent.key === 'ArrowDown' ? 1 : -1) + buttons.length) %
                  buttons.length
          ]?.focus()
        }
      },
    }
  }, [editor, setIsOpen, latest])

  useEffect(() => {
    const { openMenuRef: menuOpener } = latest

    if (menuOpener) menuOpener.current = functions.open

    return () => {
      functions.cancelFocus()
      if (menuOpener) menuOpener.current = null
    }
  }, [functions, latest])

  useEffect(() => {
    if (!isOpen) return
    // 高さの変化では閉じない。iOS Safari はスクロールでアドレスバーが縮むたびに resize を発火する
    const width = window.innerWidth
    const handleResize = () => {
      if (window.innerWidth !== width) functions.dismiss()
    }
    const mapTarget = ({ transaction }: { transaction: Transaction }) => {
      if (returnPos.current !== undefined) {
        const result = transaction.mapping.mapResult(returnPos.current)
        const node = transaction.doc.nodeAt(result.pos)
        returnPos.current =
          node && ['tableCell', 'tableHeader'].includes(node.type.name) ? result.pos : undefined
      }
      if (transaction.docChanged) functions.dismiss()
    }
    const { dismissMenuRef: menuDismisser } = latest
    if (menuDismisser) menuDismisser.current = functions.dismissHidden
    window.addEventListener('resize', handleResize)
    editor.on('transaction', mapTarget)
    return () => {
      if (menuDismisser?.current === functions.dismissHidden) menuDismisser.current = null
      window.removeEventListener('resize', handleResize)
      editor.off('transaction', mapTarget)
      latest.handleTargetLock(latest.scope, null)
    }
  }, [editor, isOpen, setIsOpen, functions, latest])

  if (!target) return null
  const label = localize(LABEL_MESSAGES[scope])
  return (
    <>
      <span
        className="shr-rte-absolute shr-rte-z-1 focus-within:shr-rte-z-[3] hover:shr-rte-z-[2]"
        style={style}
      >
        <ToolbarTooltip
          align={TOOLTIP_ALIGN[scope]}
          shortcut={TABLE_SHORTCUTS[scope]}
          suppressed={isOpen}
          label={label}
        >
          <button
            ref={triggerRef}
            type="button"
            className={`shr-rte-group/cell shr-rte-relative ${scope === 'cell' ? 'shr-rte-cursor-pointer shr-rte-border-none shr-rte-bg-transparent shr-rte-p-0 focus-visible:shr-rte-outline-none' : scope === 'table' ? 'shr-rte-border-shorthand shr-rte-flex shr-rte-cursor-pointer shr-rte-items-center shr-rte-justify-center shr-rte-rounded-m shr-rte-bg-white shr-rte-p-0 shr-rte-text-grey focus-visible:shr-rte-focus-indicator hover:shr-rte-bg-white-darken' : buttonClass}`}
            style={{ width: style.width, height: style.height }}
            aria-label={label}
            aria-keyshortcuts={toAriaKeyShortcuts(TABLE_SHORTCUTS[scope], isApple)}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            onMouseDown={(event) => event.preventDefault()}
            onKeyDown={(event) => {
              if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
                event.preventDefault()
                event.stopPropagation()
                if (!isOpen) functions.open(cellPos, event.key === 'ArrowUp', true)
              }
            }}
            onClick={(event) =>
              isOpen
                ? functions.close(true)
                : functions.open(cellPos, false, true, event.detail === 0)
            }
          >
            {scope === 'cell' ? (
              <span
                className="shr-rte-pointer-events-none shr-rte-absolute shr-rte-left-1/2 shr-rte-top-1/2 shr-rte-flex shr-rte-h-[14px] shr-rte-w-[5px] shr-rte--translate-x-1/2 shr-rte--translate-y-1/2 shr-rte-items-center shr-rte-justify-center shr-rte-rounded-s shr-rte-bg-main shr-rte-text-white group-hover/cell:shr-rte-h-[28px] group-hover/cell:shr-rte-w-[16px] group-focus-visible/cell:shr-rte-h-[28px] group-focus-visible/cell:shr-rte-w-[16px] group-aria-expanded/cell:shr-rte-h-[28px] group-aria-expanded/cell:shr-rte-w-[16px]"
                aria-hidden="true"
              >
                <span className="shr-rte-text-sm shr-rte-opacity-0 group-hover/cell:shr-rte-opacity-100 group-focus-visible/cell:shr-rte-opacity-100 group-aria-expanded/cell:shr-rte-opacity-100">
                  {'⋮'}
                </span>
              </span>
            ) : scope === 'table' ? (
              <FaEllipsisIcon />
            ) : scope === 'column' ? (
              '⋯'
            ) : (
              '⋮'
            )}
          </button>
        </ToolbarTooltip>
      </span>
      {renderDropdown(
        // メニュー内のボタンのキー操作をこの要素で受け取るため。
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div
          ref={menuRef}
          role="dialog"
          className="shr-rte-group/table-menu shr-rte-flex shr-rte-flex-col shr-rte-rounded-m shr-rte-bg-white shr-rte-py-0.5 shr-rte-shadow-layer-3"
          style={{ minWidth: 280 }}
          aria-label={label}
          data-keyboard={keyboardNavigation}
          onPointerDownCapture={() => setKeyboardNavigation(false)}
          onKeyDownCapture={() => setKeyboardNavigation(true)}
          onKeyDown={functions.handleDelegateMenuKeyDown}
        >
          <strong className="shr-rte-px-1 shr-rte-py-0.5 shr-rte-text-sm shr-rte-leading-none shr-rte-text-grey">
            {showColors
              ? localize({ id: 'smarthr-ui/RichTextEditor/cellColorMenu', defaultText: 'カラー' })
              : label}
          </strong>
          {showColors ? (
            <TableMenuItemButton
              handleClick={() => functions.handleChangeColors(false)}
              prefix={<FaArrowLeftIcon />}
            >
              {localize({
                id: 'smarthr-ui/RichTextEditor/backToTableActions',
                defaultText: '操作に戻る',
              })}
            </TableMenuItemButton>
          ) : (
            <TableMenuActions
              colorTriggerRef={colorTriggerRef}
              target={target}
              editor={editor}
              scope={scope}
              features={features}
              handleRun={functions.handleRun}
              handleChangeColors={functions.handleChangeColors}
            />
          )}
          {showColors && scope !== 'table' && features.includes('color') && (
            <TableColorPalette
              editor={editor}
              attribute="color"
              title={localize({
                id: 'smarthr-ui/RichTextEditor/cellTextColor',
                defaultText: '文字色',
              })}
              handleRun={functions.handleRun}
            />
          )}
          {showColors && scope !== 'table' && features.includes('backgroundColor') && (
            <TableColorPalette
              editor={editor}
              attribute="backgroundColor"
              title={localize({
                id: 'smarthr-ui/RichTextEditor/cellBackgroundColor',
                defaultText: '背景色',
              })}
              handleRun={functions.handleRun}
            />
          )}
        </div>,
      )}
    </>
  )
}
