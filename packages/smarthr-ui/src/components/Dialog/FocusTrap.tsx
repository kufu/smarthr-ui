import React, {
  PropsWithChildren,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import { tabbable } from '../../libs/tabbable'

type Props = PropsWithChildren<{
  firstFocusTarget?: RefObject<HTMLElement>
}>

export type FocusTrapRef = {
  focus: () => void
}

export const FocusTrap = forwardRef<FocusTrapRef, Props>(({ firstFocusTarget, children }, ref) => {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const dummyFocusRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (firstFocusTarget?.current) {
        firstFocusTarget.current.focus()
      } else {
        dummyFocusRef.current?.focus()
      }
    },
  }))

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || innerRef.current === null) {
      return
    }
    const tabbables = tabbable(innerRef.current).filter((elm) => elm.tabIndex >= 0)
    if (tabbables.length === 0) {
      return
    }
    const firstTabbale = tabbables[0]
    const lastTabbale = tabbables[tabbables.length - 1]
    const currentFocused = Array.from(tabbables).find((elm) => elm === e.target)
    if (
      e.shiftKey &&
      (currentFocused === firstTabbale || document.activeElement === dummyFocusRef.current)
    ) {
      lastTabbale.focus()
      e.preventDefault()
    } else if (!e.shiftKey && currentFocused === lastTabbale) {
      firstTabbale.focus()
      e.preventDefault()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    const triggerElement = document.activeElement
    if (firstFocusTarget?.current) {
      firstFocusTarget.current.focus()
    } else {
      dummyFocusRef.current?.focus()
    }

    return () => {
      // フォーカストラップ終了時にトリガにフォーカスを戻す
      if (triggerElement instanceof HTMLElement) {
        triggerElement.focus()
      }
    }
  }, [firstFocusTarget])

  return (
    <div ref={innerRef}>
      {/* dummy element for focus management. */}
      <div ref={dummyFocusRef} tabIndex={-1} />
      {children}
    </div>
  )
})
