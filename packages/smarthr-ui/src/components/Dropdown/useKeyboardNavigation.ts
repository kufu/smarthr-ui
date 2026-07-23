import { type RefObject, useContext, useEffect } from 'react'

import { useLatest } from '../../hooks/useLatest'
import { tabbable } from '../../libs/tabbable'

import { DropdownContext } from './Dropdown'
import { getFirstTabbable } from './dropdownHelper'

const KEY_ESCAPE = /^Esc(ape)?$/

export function useKeyboardNavigation(
  wrapperRef: RefObject<HTMLDivElement>,
  dummyFocusRef: RefObject<HTMLElement>,
) {
  const { triggerElementRef, rootTriggerRef, onClickCloser } = useContext(DropdownContext)

  const latest = useLatest({
    wrapperRef,
    triggerElementRef,
    rootTriggerRef,
    dummyFocusRef,
    onClickCloser,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (
          !latest.wrapperRef.current ||
          !latest.triggerElementRef.current ||
          !latest.rootTriggerRef?.current
        ) {
          return
        }

        const tabbablesInContent = tabbable(latest.wrapperRef.current)

        if (tabbablesInContent.length === 0) {
          return
        }

        const trigger = tabbable(latest.triggerElementRef.current).at(-1)
        const firstTabbable = tabbablesInContent[0]

        if (e.target === trigger) {
          if (e.shiftKey) {
            // move focus previous of the Trigger
            return
          }

          // focus a first tabbable element in the dropdown content
          e.preventDefault()
          firstTabbable.focus()

          return
        } else if (e.shiftKey) {
          if (e.target === firstTabbable || e.target === latest.dummyFocusRef.current) {
            // focus the Trigger
            e.preventDefault()
            trigger!.focus()
            latest.onClickCloser()
          }
        } else if (e.target === tabbablesInContent.at(-1)) {
          // move focus next of the Trigger
          const rootTrigger = tabbable(latest.rootTriggerRef.current).at(-1)

          if (rootTrigger) {
            rootTrigger.focus()
            latest.onClickCloser()
          }
        }
      } else if (KEY_ESCAPE.test(e.key)) {
        if (e.target && e.target === latest.dummyFocusRef.current) {
          latest.onClickCloser()

          return
        }

        const trigger = getFirstTabbable(latest.triggerElementRef)

        if (trigger && e.target === trigger) {
          // close the dropdown when the Trigger is focused and Esc key is pressed
          latest.onClickCloser()

          return
        }

        if (latest.wrapperRef.current) {
          for (const inner of tabbable(latest.wrapperRef.current)) {
            if (inner === e.target) {
              // close the dropdown when an element that is included in dropdown content is focused and Esc key is pressed
              latest.onClickCloser()

              break
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [latest])
}
