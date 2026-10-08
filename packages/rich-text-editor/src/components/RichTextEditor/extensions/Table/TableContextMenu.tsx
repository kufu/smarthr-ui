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
import { ToolbarTooltip } from '../../Toolbar/ToolbarTooltip'
import { toAriaKeyShortcuts } from '../../Toolbar/shortcutKeys'
import { useIsApplePlatform } from '../../hooks/useIsApplePlatform'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'

import { TableColorPalette } from './TableColorPalette'
import { TableMenuActions } from './TableMenuActions'
import { TableMenuItemButton } from './TableMenuItemButton'
import { TABLE_SHORTCUTS } from './tableShortcuts'
import { focusTableCell, getTableTarget, runTableAction, selectTableTarget } from './tableTarget'

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
  handleTargetLock,
}: Props) => {
  const { localize } = useIntl()
  const isApple = useIsApplePlatform()
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [showColors, setShowColors] = useState(false)
  // 列のハンドルは矩形が列幅そのものなので、既定の左端揃えでは選択中の列が隠れる
  const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown(showColors, {
    avoidTrigger: scope === 'column',
  })
  const colorTriggerRef = useRef<HTMLButtonElement>(null)
  const returnToTrigger = useRef(false)
  const focusFrame = useRef<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuCellPos, setMenuCellPos] = useState(cellPos)
  const returnPos = useRef<number | undefined>(cellPos)
  const target = getTableTarget(editor, isOpen ? menuCellPos : cellPos)

  const latest = useLatest({
    cellPos,
    scope,
    showColors,
    openMenuRef,
    handleTargetLock,
    triggerRef,
  })

  const functions = useMemo(() => {
    const cancelFocus = () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
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

    return {
      cancelFocus,
      open: (pos = latest.cellPos, last = false, fromTrigger = false, keyboard = true) => {
        setKeyboardNavigation(keyboard)
        returnToTrigger.current = fromTrigger
        returnPos.current = pos
        setMenuCellPos(pos)
        latest.handleTargetLock(latest.scope, pos)
        if (selectTableTarget(editor, pos, latest.scope)) {
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
            close()
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
    const handleScroll = (event: Event) => {
      if (!(
        event.target instanceof Node &&
        (menuRef.current?.contains(event.target) || event.target === menuRef.current?.parentElement)
      )) {
        setIsOpen(false)
        if (menuRef.current?.contains(document.activeElement))
          focusTableCell(editor, returnPos.current)
      }
    }
    const mapTarget = ({ transaction }: { transaction: Transaction }) => {
      if (returnPos.current !== undefined) {
        const result = transaction.mapping.mapResult(returnPos.current)
        const node = transaction.doc.nodeAt(result.pos)
        returnPos.current =
          node && ['tableCell', 'tableHeader'].includes(node.type.name) ? result.pos : undefined
      }
      if (transaction.docChanged) setIsOpen(false)
    }
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)
    editor.on('transaction', mapTarget)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
      editor.off('transaction', mapTarget)
      latest.handleTargetLock(latest.scope, null)
    }
  }, [editor, isOpen, setIsOpen, latest])

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
