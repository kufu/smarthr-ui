'use client'

import {
  type FC,
  type JSXElementConstructor,
  type KeyboardEvent,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FaArrowDownIcon, FaArrowUpIcon, FaCopyIcon, FaTrashCanIcon } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { formatShortcutTokens, toAriaKeyShortcuts } from '../../Toolbar/shortcutKeys'
import { useIsApplePlatform } from '../../hooks/useIsApplePlatform'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'
import { TableMenuItemButton } from '../Table/TableMenuItemButton'

import { getBlockShortcuts } from './blockShortcuts'

import type { BlockMenuOptions } from './BlockActions'
import type { BlockRange } from './blockRange'
import type { LabelDescriptor } from '../blockCatalog'
import type { SingleCommands } from '@tiptap/core'
import type { Transaction } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/react'

type BlockCommands = Pick<SingleCommands, 'moveBlocks' | 'duplicateBlocks' | 'deleteBlocks'>

type BlockMenuItem = {
  id: 'moveUp' | 'moveDown' | 'duplicate' | 'delete'
  label: LabelDescriptor
  icon: JSXElementConstructor<Record<string, never>>
  shortcut?: 'moveUp' | 'moveDown'
  run: (commands: BlockCommands, range: BlockRange) => boolean
}

const BLOCK_MENU_ITEMS: readonly BlockMenuItem[] = [
  {
    id: 'moveUp',
    label: { id: 'smarthr-ui/RichTextEditor/blockMoveUp', defaultText: '上へ移動' },
    icon: FaArrowUpIcon,
    shortcut: 'moveUp',
    run: (commands, range) => commands.moveBlocks({ range, to: 'up' }),
  },
  {
    id: 'moveDown',
    label: { id: 'smarthr-ui/RichTextEditor/blockMoveDown', defaultText: '下へ移動' },
    icon: FaArrowDownIcon,
    shortcut: 'moveDown',
    run: (commands, range) => commands.moveBlocks({ range, to: 'down' }),
  },
  {
    id: 'duplicate',
    label: { id: 'smarthr-ui/RichTextEditor/blockDuplicate', defaultText: '複製' },
    icon: FaCopyIcon,
    run: (commands, range) => commands.duplicateBlocks({ range }),
  },
  {
    id: 'delete',
    label: { id: 'smarthr-ui/RichTextEditor/blockDelete', defaultText: '削除' },
    icon: FaTrashCanIcon,
    run: (commands, range) => commands.deleteBlocks({ range }),
  },
]

const MENU_CLASS_NAME = 'shr-rte-flex shr-rte-min-w-[12rem] shr-rte-flex-col shr-rte-py-0.5'
const SHORTCUT_CLASS_NAME = 'shr-rte-ml-auto shr-rte-pl-1 shr-rte-text-sm shr-rte-text-grey'

type Props = { editor: Editor }

export const BlockMenu: FC<Props> = memo(({ editor }) => {
  const { localize } = useIntl()
  const isApple = useIsApplePlatform()
  const { isOpen, setIsOpen, openFrom, restoreFocus, renderDropdown } = useToolbarDropdown()
  const [range, setRange] = useState<BlockRange | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const focusFrame = useRef<number | null>(null)
  const onCloseRef = useRef<(() => void) | null>(null)

  const latest = useLatest({ editor, range, setIsOpen, openFrom, restoreFocus })

  const functions = useMemo(() => {
    const getItems = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

    const close = () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
      focusFrame.current = null
      latest.setIsOpen(false)
      latest.restoreFocus()
    }

    return {
      open: (target: BlockRange, { getAnchorRect, onClose }: BlockMenuOptions = {}) => {
        setRange(target)
        onCloseRef.current = onClose ?? null
        latest.openFrom({
          getAnchorRect:
            getAnchorRect ??
            (() => latest.editor.view.coordsAtPos(latest.editor.state.selection.head)),
          returnFocus: () => {
            if (!latest.editor.isDestroyed) latest.editor.view.focus()
          },
        })

        if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
        // 位置が決まって見えるようになるまでは、項目にフォーカスを移せない
        focusFrame.current = requestAnimationFrame(() => {
          focusFrame.current = null
          const index = BLOCK_MENU_ITEMS.findIndex(({ run }) => run(latest.editor.can(), target))

          getItems()[index]?.focus()
        })
      },
      // 開いたときの範囲は、文書が変わると別のブロックを指しうる
      handleTransaction: ({ transaction }: { transaction: Transaction }) => {
        if (!transaction.docChanged) return

        if (menuRef.current?.contains(document.activeElement)) close()
        else latest.setIsOpen(false)
      },
      handleRun: (run: BlockMenuItem['run']) => {
        const target = latest.range

        close()

        if (target) run(latest.editor.commands, target)
      },
      handleDelegateKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.nativeEvent.isComposing) return

        switch (e.key) {
          case 'Escape':
          case 'Tab':
            e.preventDefault()
            // smarthr-ui の Dialog は document で Esc を受け、defaultPrevented を見ないので、止めないと一緒に閉じる
            e.stopPropagation()
            close()

            return
          case 'ArrowDown':
          case 'ArrowUp':
          case 'Home':
          case 'End': {
            e.preventDefault()

            const items = getItems()
            const index = items.indexOf(document.activeElement as HTMLElement)
            const next =
              e.key === 'Home'
                ? 0
                : e.key === 'End'
                  ? items.length - 1
                  : (index + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length

            items[next]?.focus()
          }
        }
      },
    }
  }, [latest])

  useEffect(() => {
    const storage = editor.storage.blockActions

    if (!storage) return undefined

    storage.openMenu = functions.open

    if (isOpen) editor.on('transaction', functions.handleTransaction)

    return () => {
      if (storage.openMenu === functions.open) storage.openMenu = null

      editor.off('transaction', functions.handleTransaction)

      // 閉じる経路は useToolbarDropdown の中（外のクリック・フォーカスの移動）にもあり、isOpen の変化でしか揃えて拾えない
      if (isOpen) {
        const onClose = onCloseRef.current

        onCloseRef.current = null
        onClose?.()
      }
    }
  }, [editor, isOpen, functions])

  const shortcuts = getBlockShortcuts(isApple)

  return renderDropdown(
    // フォーカスは項目に置き、menu 自身には置かない
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      ref={menuRef}
      role="menu"
      className={MENU_CLASS_NAME}
      aria-label={localize({
        id: 'smarthr-ui/RichTextEditor/blockMenu',
        defaultText: 'ブロックの操作',
      })}
      onKeyDown={functions.handleDelegateKeyDown}
    >
      {range &&
        BLOCK_MENU_ITEMS.map(({ id, label, icon: Icon, shortcut: shortcutName, run }) => {
          const shortcut = shortcutName && shortcuts[shortcutName]

          return (
            <TableMenuItemButton
              key={id}
              role="menuitem"
              disabled={!run(editor.can(), range)}
              tabIndex={-1}
              aria-keyshortcuts={shortcut ? toAriaKeyShortcuts(shortcut, isApple) : undefined}
              handleClick={() => functions.handleRun(run)}
              prefix={<Icon />}
              suffix={
                shortcut && (
                  <span className={SHORTCUT_CLASS_NAME} aria-hidden="true">
                    {formatShortcutTokens(shortcut, isApple).join('+')}
                  </span>
                )
              }
            >
              {localize(label)}
            </TableMenuItemButton>
          )
        })}
    </div>,
  )
})
