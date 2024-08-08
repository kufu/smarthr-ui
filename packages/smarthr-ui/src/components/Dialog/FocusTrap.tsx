import React, { FC, PropsWithChildren, RefObject, useCallback, useEffect, useRef } from 'react'

import { tabbable } from '../../libs/tabbable'

type Props = PropsWithChildren<{
  firstFocusTarget?: RefObject<HTMLElement>
  returnFocusToTriggerElement?: boolean
}>

export const FocusTrap: FC<Props> = ({
  firstFocusTarget,
  children,
  returnFocusToTriggerElement = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const dummyFocusRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || ref.current === null) {
      return
    }
    const tabbables = tabbable(ref.current).filter((elm) => elm.tabIndex >= 0)
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
      if (triggerElement instanceof HTMLElement && returnFocusToTriggerElement) {
        console.log('FocusTrap return focus')
        triggerElement.focus()
      }
    }
  }, [firstFocusTarget, returnFocusToTriggerElement])

  return (
    <div ref={ref}>
      {/* dummy element for focus management. */}
      <div ref={dummyFocusRef} tabIndex={-1} />
      {children}
    </div>
  )
}
