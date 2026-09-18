'use client'
import { type KeyboardEvent, type MutableRefObject, useEffect, useRef, useState } from 'react'

import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'

import {
  type TableScope,
  focusTableCell,
  getTableTarget,
  runTableAction,
  selectTableTarget,
} from './tableTarget'

import type { Transaction } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/react'
type Props = {
  editor: Editor
  cellPos: number
  scope: TableScope
  openMenuRef?: MutableRefObject<((pos?: number) => void) | null>
  onTargetLock: (scope: TableScope, pos: number | null) => void
}
export const useTableMenu = ({ editor, cellPos, scope, openMenuRef, onTargetLock }: Props) => {
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

  const scheduleFocus = (focus: () => void) => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null
      focus()
    })
  }
  useEffect(
    () => () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
    },
    [],
  )
  const open = (pos = cellPos, last = false, fromTrigger = false, keyboard = true) => {
    setKeyboardNavigation(keyboard)
    returnToTrigger.current = fromTrigger
    returnPos.current = pos
    setMenuCellPos(pos)
    onTargetLock(scope, pos)
    if (selectTableTarget(editor, pos, scope)) {
      setShowColors(false)
      setIsOpen(true)
      scheduleFocus(() => {
        const buttons =
          menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
        buttons?.[last ? buttons.length - 1 : 0]?.focus()
      })
    }
  }
  useEffect(() => {
    if (!openMenuRef) return
    openMenuRef.current = open
    return () => {
      openMenuRef.current = null
    }
  })
  useEffect(() => {
    if (!isOpen) return
    return () => onTargetLock(scope, null)
  }, [isOpen, scope, onTargetLock])
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
    }
  }, [editor, isOpen, setIsOpen])
  const close = (restoreTrigger = false) => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)
    setIsOpen(false)
    if (restoreTrigger) triggerRef.current?.focus({ preventScroll: true })
    else focusTableCell(editor, returnPos.current)
  }
  const run = (action: () => unknown) => {
    runTableAction(editor, action)
    close()
  }
  const changeColors = (show: boolean) => {
    setShowColors(show)
    scheduleFocus(() => {
      if (show) menuRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
      else colorTriggerRef.current?.focus()
    })
  }
  const onMenuKeyDown = (delegateEvent: KeyboardEvent<HTMLDivElement>) => {
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
    if (showColors && ['Escape', 'ArrowLeft'].includes(delegateEvent.key)) {
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
  }
  return {
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
    onMenuKeyDown,
  }
}
