import React, { ReactNode, VFC, useCallback, useEffect, useRef, useState } from 'react'

import { tabbable } from '../../libs/tabbable'

type Props = {
  children: ReactNode
}

export const FocusTrap: VFC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null)

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

  const { moveFocusFromTrigger, returnFocusToTrigger } = useTriggerFocusControl(ref)
  useEffect(() => {
    moveFocusFromTrigger()
    return returnFocusToTrigger
  }, [moveFocusFromTrigger, returnFocusToTrigger])

  return <div ref={ref}>{children}</div>
}

export function useTriggerFocusControl(targetRef: React.RefObject<HTMLElement>) {
  const [triggerElement, setTriggerElement] = useState<Element | null>(null)

  const moveFocusFromTrigger = useCallback(() => {
    setTriggerElement(document.activeElement)
    setTimeout(() => {
      // delay focus on the first element so that is occurs last
      if (targetRef.current === null) {
        return
      }
      const tabbables = tabbable(targetRef.current)
      const firstTabbale = tabbables[0]
      if (firstTabbale) {
        firstTabbale.focus()
      }
    }, 1)
  }, [targetRef])

  const returnFocusToTrigger = useCallback(() => {
    if (triggerElement instanceof HTMLElement) {
      triggerElement.focus()
    }
    setTriggerElement(null)
  }, [triggerElement])

  return { moveFocusFromTrigger, returnFocusToTrigger }
}
