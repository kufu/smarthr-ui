'use client'

import { Button, FaArrowLeftIcon, FaEllipsisIcon } from 'smarthr-ui'

import { useIntl } from '../../../../intl'
import { ToolbarTooltip } from '../../Toolbar/ToolbarTooltip'
import { toAriaKeyShortcuts } from '../../Toolbar/shortcutKeys'
import { useIsApplePlatform } from '../../hooks/useIsApplePlatform'

import { TableColorPalette } from './TableColorPalette'
import { TableMenuActions } from './TableMenuActions'
import { tableMenuItemClass as itemClass } from './tableMenuStyles'
import { TABLE_SHORTCUTS } from './tableShortcuts'
import { useTableMenu } from './useTableMenu'

import type { TableScope } from './tableTarget'
import type { RichTextFeature } from '../../types'
import type { Editor } from '@tiptap/react'
import type { CSSProperties, MutableRefObject } from 'react'

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

type Props = {
  features: readonly RichTextFeature[]
  openMenuRef?: MutableRefObject<((pos?: number) => void) | null>
  onTargetLock: (scope: TableScope, pos: number | null) => void
  editor: Editor
  cellPos: number
  scope: TableScope
  style: CSSProperties
}

const buttonClass =
  'shr-border-none shr-rounded-full shr-bg-white-darken shr-text-grey shr-cursor-pointer hover:shr-text-black aria-expanded:shr-bg-main aria-expanded:shr-text-white focus-visible:shr-focus-indicator'

export const TableContextMenu = ({
  editor,
  cellPos,
  scope,
  style,
  features,
  openMenuRef,
  onTargetLock,
}: Props) => {
  const { localize } = useIntl()
  const isApple = useIsApplePlatform()
  const {
    keyboardNavigation,
    setKeyboardNavigation,
    showColors,
    isOpen,
    triggerRef,
    renderDropdown,
    colorTriggerRef,
    menuRef,
    target,
    open,
    close,
    run,
    changeColors,
    onMenuKeyDown: delegateMenuKeyDown,
  } = useTableMenu({ editor, cellPos, scope, openMenuRef, onTargetLock })
  if (!target) return null
  const label =
    scope === 'table'
      ? localize({ id: 'smarthr-ui/RichTextEditor/tableActions', defaultText: '表の操作' })
      : scope === 'row'
        ? localize({ id: 'smarthr-ui/RichTextEditor/rowActions', defaultText: '行の操作' })
        : scope === 'column'
          ? localize({ id: 'smarthr-ui/RichTextEditor/columnActions', defaultText: '列の操作' })
          : localize({ id: 'smarthr-ui/RichTextEditor/cellActions', defaultText: 'セルの操作' })
  return (
    <>
      <span className="shr-absolute shr-z-1 focus-within:shr-z-[3] hover:shr-z-[2]" style={style}>
        <ToolbarTooltip
          align={TOOLTIP_ALIGN[scope]}
          shortcut={TABLE_SHORTCUTS[scope]}
          suppressed={isOpen}
          label={label}
        >
          <button
            ref={triggerRef}
            type="button"
            className={`shr-group/cell shr-relative ${scope === 'cell' ? 'shr-cursor-pointer shr-border-none shr-bg-transparent shr-p-0 focus-visible:shr-outline-none' : scope === 'table' ? 'shr-border-shorthand shr-flex shr-cursor-pointer shr-items-center shr-justify-center shr-rounded-m shr-bg-white shr-p-0 shr-text-grey focus-visible:shr-focus-indicator hover:shr-bg-white-darken' : buttonClass}`}
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
                if (!isOpen) open(cellPos, event.key === 'ArrowUp', true)
              }
            }}
            onClick={(event) =>
              isOpen ? close(true) : open(cellPos, false, true, event.detail === 0)
            }
          >
            {scope === 'cell' ? (
              <span
                className="shr-pointer-events-none shr-absolute shr-left-1/2 shr-top-1/2 shr-flex shr-h-[14px] shr-w-[5px] shr--translate-x-1/2 shr--translate-y-1/2 shr-items-center shr-justify-center shr-rounded-s shr-bg-main shr-text-white group-hover/cell:shr-h-[28px] group-hover/cell:shr-w-[16px] group-focus-visible/cell:shr-h-[28px] group-focus-visible/cell:shr-w-[16px] group-aria-expanded/cell:shr-h-[28px] group-aria-expanded/cell:shr-w-[16px]"
                aria-hidden="true"
              >
                <span className="shr-text-sm shr-opacity-0 group-hover/cell:shr-opacity-100 group-focus-visible/cell:shr-opacity-100 group-aria-expanded/cell:shr-opacity-100">
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
          className="shr-group/table-menu shr-flex shr-flex-col shr-rounded-m shr-bg-white shr-py-0.5 shr-shadow-layer-3"
          style={{ minWidth: 280 }}
          aria-label={label}
          data-keyboard={keyboardNavigation}
          onPointerDownCapture={() => setKeyboardNavigation(false)}
          onKeyDownCapture={() => setKeyboardNavigation(true)}
          onKeyDown={delegateMenuKeyDown}
        >
          <strong className="shr-px-1 shr-py-0.5 shr-text-sm shr-leading-none shr-text-grey">
            {showColors
              ? localize({ id: 'smarthr-ui/RichTextEditor/cellColorMenu', defaultText: 'カラー' })
              : label}
          </strong>
          {showColors ? (
            <Button
              type="button"
              variant="text"
              className={itemClass}
              onClick={() => changeColors(false)}
              prefix={<FaArrowLeftIcon />}
            >
              {localize({
                id: 'smarthr-ui/RichTextEditor/backToTableActions',
                defaultText: '操作に戻る',
              })}
            </Button>
          ) : (
            <TableMenuActions
              colorTriggerRef={colorTriggerRef}
              target={target}
              editor={editor}
              scope={scope}
              features={features}
              run={run}
              changeColors={changeColors}
            />
          )}
          {showColors && scope !== 'table' && features.includes('color') && (
            <TableColorPalette
              editor={editor}
              run={run}
              attribute="color"
              title={localize({
                id: 'smarthr-ui/RichTextEditor/cellTextColor',
                defaultText: '文字色',
              })}
            />
          )}
          {showColors && scope !== 'table' && features.includes('backgroundColor') && (
            <TableColorPalette
              editor={editor}
              run={run}
              attribute="backgroundColor"
              title={localize({
                id: 'smarthr-ui/RichTextEditor/cellBackgroundColor',
                defaultText: '背景色',
              })}
            />
          )}
        </div>,
      )}
    </>
  )
}
