import { RefObject, useCallback, useContext, useEffect } from 'react'
import { tabbable } from './tabbable'

import { DropdownContext } from './Dropdown'
import { getFirstTabbable } from './dropdownHelper'

export function useKeyboardNavigation(wrapperRef: RefObject<HTMLDivElement>) {
  const { triggerElementRef, rootTriggerRef, onClickCloser } = useContext(DropdownContext)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (
          !wrapperRef.current ||
          !triggerElementRef.current ||
          !rootTriggerRef ||
          !rootTriggerRef.current
        ) {
          return
        }
        const tabbablesInContent = tabbable(wrapperRef.current)
        if (tabbablesInContent.length === 0) {
          return
        }
        const triggers = tabbable(triggerElementRef.current)
        const trigger = triggers[triggers.length - 1]
        const firstTabbable = tabbablesInContent[0]
        const lastTabbable = tabbablesInContent[tabbablesInContent.length - 1]

        if (e.target === trigger) {
          if (e.shiftKey) {
            // move focus previous of the Trigger
            return
          }
          // focus a first tabbable element in the dropdown content
          e.preventDefault()
          firstTabbable.focus()
          return
        } else if (e.shiftKey && e.target === firstTabbable) {
          // focus the Trigger
          e.preventDefault()
          trigger.focus()
        } else if (!e.shiftKey && e.target === lastTabbable) {
          // move focus next of the Trigger
          const rootTriggers = tabbable(rootTriggerRef.current)
          const rootTrigger = rootTriggers[rootTriggers.length - 1]
          if (rootTrigger) {
            rootTrigger.focus()
          }
        }
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        if (triggerElementRef.current) {
          const trigger = getFirstTabbable(triggerElementRef)
          if (trigger && e.target === trigger) {
            // close the dropdown when the Trigger is focused and Esc key is pressed
            onClickCloser()
            return
          }
        }

        if (wrapperRef.current) {
          const tabbablesInContent = tabbable(wrapperRef.current)
          tabbablesInContent.some((inner) => {
            if (inner === e.target) {
              // close the dropdown when an element that is included in dropdown content is focused and Esc key is pressed
              onClickCloser()
              return true
            }
            return false
          })
        }
      }
    },
    [wrapperRef, triggerElementRef, rootTriggerRef, onClickCloser],
  )
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
