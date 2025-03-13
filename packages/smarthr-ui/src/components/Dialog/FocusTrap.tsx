import React, {
  type PropsWithChildren,
  type RefObject,
  forwardRef,
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || innerRef.current === null) {
        return
      }

      const tabbables = tabbable(innerRef.current).filter((elm) => elm.tabIndex >= 0)

      if (tabbables.length === 0) {
        return
      }

      const firstTabbable = tabbables[0]
      const lastTabbable = tabbables[tabbables.length - 1]
      const currentFocused = tabbables.find((elm) => elm === e.target)

      if (e.shiftKey) {
        if (currentFocused === firstTabbable || document.activeElement === dummyFocusRef.current) {
          e.preventDefault()
          lastTabbable.focus()
        }
      } else if (currentFocused === lastTabbable) {
        e.preventDefault()
        firstTabbable.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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
