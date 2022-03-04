import React, { ReactNode, VFC, useCallback, useEffect, useRef, useState } from 'react'

import { tabbable } from '../../libs/tabbable'

type Props = {
  children: ReactNode
}

export const FocusTrap: VFC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const focusTargetRef = useRef<HTMLDivElement>(null)

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
    if (e.shiftKey && currentFocused === firstTabbale) {
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

  const { returnFocusToTrigger } = useTriggerFocusControl()
  useEffect(() => {
    focusTargetRef.current?.focus()
    return returnFocusToTrigger
  }, [returnFocusToTrigger])

  return (
    <div ref={ref}>
      {/* dummy element for focus management. */}
      <div ref={focusTargetRef} tabIndex={-1} />
      {children}
    </div>
  )
}

export function useTriggerFocusControl() {
  const [triggerElement, setTriggerElement] = useState<Element | null>(null)

  const returnFocusToTrigger = useCallback(() => {
    if (triggerElement instanceof HTMLElement) {
      triggerElement.focus()
    }
    setTriggerElement(null)
  }, [triggerElement])

  return { returnFocusToTrigger }
}
