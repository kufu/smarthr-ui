'use client'

import {
  type FC,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { Button, Cluster, Stack } from 'smarthr-ui'

import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { TOOLBAR_POPUP_CLASS_NAME } from '../../Toolbar/toolbarItemStyle'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'

import { IMAGE_TOOLBAR_BUTTON_CLASS_NAME } from './imageToolbarStyle'

import type { Transaction } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/react'

type Props = {
  editor: Editor
  pos: number
  icon: ReactNode
  label: string
  initialFocusRef: RefObject<HTMLInputElement | null>
  handleOpen: (pos: number) => void
  handleSubmit: (pos: number) => void
  secondaryAction?: { label: string; handleClick: (pos: number) => void }
  children: ReactNode
  tabIndex?: number
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const ImagePopoverForm: FC<Props> = ({
  editor,
  pos,
  icon,
  label,
  initialFocusRef,
  handleOpen,
  handleSubmit,
  secondaryAction,
  children,
  tabIndex = -1,
  onKeyDown,
  onFocus,
  ref: refProp,
}) => {
  const { localize } = useIntl()
  const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
  const mergedTriggerRef = useMergeRefs(triggerRef, refProp)
  const dialogRef = useRef<HTMLDivElement>(null)
  const focusFrame = useRef<number | null>(null)
  const targetPos = useRef(pos)

  const applyLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageApplyButton',
    defaultText: '適用',
  })

  const latest = useLatest({
    isOpen,
    pos,
    initialFocusRef,
    triggerRef,
    handleOpen,
    handleSubmit,
    secondaryAction,
    onKeyDown,
  })

  const functions = useMemo(() => {
    const cancelFocus = () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current)

      focusFrame.current = null
    }
    const open = () => {
      targetPos.current = latest.pos
      latest.handleOpen(targetPos.current)
      setIsOpen(true)
      cancelFocus()
      // 開いた直後は位置を測る間 visibility:hidden で、フォーカスを受け付けない
      focusFrame.current = requestAnimationFrame(() => {
        focusFrame.current = null
        latest.initialFocusRef.current?.focus()
      })
    }
    const close = () => {
      cancelFocus()
      setIsOpen(false)
      latest.triggerRef.current?.focus()
    }

    return {
      cancelFocus,
      handleTriggerClick: () => {
        if (latest.isOpen) close()
        else open()
      },
      handleTriggerKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()

          if (!latest.isOpen) open()

          return
        }

        latest.onKeyDown?.(e)
      },
      handleSubmit: (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        latest.handleSubmit(targetPos.current)
        close()
      },
      handleSecondaryAction: () => {
        latest.secondaryAction?.handleClick(targetPos.current)
        close()
      },
      handlePopupKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          close()
        }
      },
    }
  }, [setIsOpen, latest])

  useEffect(() => {
    if (!isOpen) return

    const targetDOM = editor.view.nodeDOM(targetPos.current)

    // 入力中の値は開いたときの画像のもの。選択が別の画像へ移ったまま適用すると、そちらへ書き込んでしまう
    const handleTransaction = ({
      transaction,
      appendedTransactions,
    }: {
      transaction: Transaction
      appendedTransactions: Transaction[]
    }) => {
      const mapped = [transaction, ...appendedTransactions].reduce(
        (current, tr) => tr.mapping.map(current),
        targetPos.current,
      )
      // 属性の更新でも画像は丸ごと置き換わり mapResult の deleted が立つ。位置とノードの種類だけでは、
      // 削除で後ろの画像が詰まってきた場合と区別できないので、属性の更新では作り直されない NodeView の DOM で見分ける
      if (editor.view.nodeDOM(mapped) !== targetDOM || editor.state.selection.from !== mapped) {
        const hadFocus = dialogRef.current?.contains(document.activeElement)

        functions.cancelFocus()
        setIsOpen(false)

        if (hadFocus) latest.triggerRef.current?.focus()

        return
      }

      targetPos.current = mapped
    }

    editor.on('transaction', handleTransaction)

    return () => {
      editor.off('transaction', handleTransaction)
      functions.cancelFocus()
    }
  }, [editor, isOpen, setIsOpen, functions, latest])

  return (
    <>
      <button
        ref={mergedTriggerRef}
        type="button"
        tabIndex={tabIndex}
        className={IMAGE_TOOLBAR_BUTTON_CLASS_NAME}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onMouseDown={(e) => e.preventDefault()}
        onClick={functions.handleTriggerClick}
        onKeyDown={functions.handleTriggerKeyDown}
        onFocus={onFocus}
      >
        {icon}
        {label}
      </button>
      {renderDropdown(
        <div ref={dialogRef} role="dialog" className={TOOLBAR_POPUP_CLASS_NAME} aria-label={label}>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <form
            noValidate
            onSubmit={functions.handleSubmit}
            onKeyDown={functions.handlePopupKeyDown}
          >
            <Stack gap={0.75}>
              {children}
              <Cluster gap={0.5} justify="flex-end">
                {secondaryAction && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="S"
                    onClick={functions.handleSecondaryAction}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
                <Button type="submit" variant="primary" size="S">
                  {applyLabel}
                </Button>
              </Cluster>
            </Stack>
          </form>
        </div>,
      )}
    </>
  )
}
