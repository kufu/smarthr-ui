import React, { FC, PropsWithChildren, RefObject, useEffect, useRef } from 'react'

import { tabbable } from '../../libs/tabbable'

type Props = PropsWithChildren<{
  firstFocusTarget?: RefObject<HTMLElement>
}>

export const FocusTrap: FC<Props> = ({ firstFocusTarget, children }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const dummyFocusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || ref.current === null) {
        return
      }

      const tabbables = tabbable(ref.current).filter((elm) => elm.tabIndex >= 0)

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
    <div ref={ref}>
      {/* dummy element for focus management. */}
      <div ref={dummyFocusRef} tabIndex={-1} />
      {children}
    </div>
  )
}
