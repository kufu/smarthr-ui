'use client'

import {
  type FC,
  type MouseEvent,
  type MutableRefObject,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { usePortal } from '../../../hooks/client/usePortal'
import { useLatest } from '../../../hooks/useLatest'
import { findDelegateTarget } from '../../../libs/delegate'
import { tabbable } from '../../../libs/tabbable'
import { DROPDOWN_CLOSER_CLASS_NAME } from '../DropdownCloser'

import { DROPDOWN_CONTENT_CLASS_NAME, DUMMY_FOCUS_CONTENT_CLASSNAME } from './constants'

import type { Rect } from './types'

type Props = PropsWithChildren<{
  onOpen?: () => void
  onClose?: () => void
}>

type DropdownContextType = {
  active: boolean
  triggerRect: Rect
  triggerElementRef: MutableRefObject<HTMLDivElement | null>
  triggerLayoutEffectRef: (node: HTMLElement | null) => void
  contentCallbackRef: (node: HTMLElement | null) => void
  handleDelegateClickTrigger: (e: MouseEvent<HTMLElement>) => void
  handleDelegateClickContentCloser: (e: MouseEvent<HTMLElement>) => void
  DropdownContentRoot: FC<{ children: ReactNode }>
  contentId: string
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }
const KEY_ESCAPE = /^Esc(ape)?$/
const NOOP = () => null

export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  triggerRect: initialRect,
  triggerElementRef: createRef(),
  triggerLayoutEffectRef: NOOP,
  contentCallbackRef: NOOP,
  handleDelegateClickTrigger: NOOP,
  handleDelegateClickContentCloser: NOOP,
  DropdownContentRoot: NOOP,
  contentId: '',
})

export const Dropdown: FC<Props> = ({ onOpen, onClose, children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const contentId = useId()
  const { createPortal, isChildPortal, PortalParentProvider } = usePortal({
    rootId: contentId,
  })

  const triggerElementRef = useRef<HTMLDivElement>(null)
  const openFrame = useAnimationFrame()
  const closeFrame = useAnimationFrame()

  const latest = useLatest({
    active,
    isChildPortal,
    onOpen,
    onClose,
    createPortal,
    openFrame,
    closeFrame,
  })

  const functions = useMemo(() => {
    let dummyFocusContent: HTMLElement | null | undefined = null

    // This is the root container of a dropdown content located in outside the DOM tree
    const DropdownContentRoot: FC<{ children: ReactNode }> = (props) =>
      latest.active ? latest.createPortal(props.children) : null
    DropdownContentRoot.displayName = 'DropdownContentRoot'

    const actualClose = () => {
      if (latest.onClose) {
        latest.closeFrame.request(() => latest.onClose?.())
      }
    }
    const handleDelegateClickCloser = () => {
      setActive(false)
      actualClose()

      // return focus to the Trigger
      if (triggerElementRef.current) {
        tabbable(triggerElementRef.current)[0]?.focus()
      }
    }

    return {
      DropdownContentRoot,
      contentCallbackRef: (node: HTMLElement | null) => {
        dummyFocusContent = node?.querySelector<HTMLElement>(`.${DUMMY_FOCUS_CONTENT_CLASSNAME}`)

        if (!node) {
          return
        }

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (!triggerElementRef.current) {
              return
            }

            const tabbablesInContent = tabbable(node)

            if (tabbablesInContent.length === 0) {
              return
            }

            const trigger = tabbable(triggerElementRef.current).at(-1)
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
              if (e.target === firstTabbable || e.target === dummyFocusContent) {
                // focus the Trigger
                e.preventDefault()
                trigger!.focus()
                handleDelegateClickCloser()
              }
            } else if (e.target === tabbablesInContent.at(-1)) {
              // focus the Trigger
              e.preventDefault()
              trigger!.focus()
              handleDelegateClickCloser()
            }
          } else if (KEY_ESCAPE.test(e.key)) {
            if (e.target && e.target === dummyFocusContent) {
              handleDelegateClickCloser()

              return
            }

            const trigger = triggerElementRef.current
              ? tabbable(triggerElementRef.current)[0]
              : undefined

            if (trigger && e.target === trigger) {
              // close the dropdown when the Trigger is focused and Esc key is pressed
              handleDelegateClickCloser()

              return
            }

            for (const inner of tabbable(node)) {
              if (inner === e.target) {
                // close the dropdown when an element that is included in dropdown content is focused and Esc key is pressed
                handleDelegateClickCloser()

                break
              }
            }
          }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
          window.removeEventListener('keydown', handleKeyDown)
        }
      },
      actualClose,
      handleDelegateClickTrigger: (e: MouseEvent<HTMLElement>) => {
        const button = (e.target as HTMLElement).closest('button')

        // 引き金となる要素が disabled な場合、処理を差し込む必要がない
        if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') {
          return
        } else if (latest.active) {
          setActive(false)
          actualClose()
        } else {
          setActive(true)
          setTriggerRect(button.getBoundingClientRect())

          if (latest.onOpen) {
            latest.openFrame.request(() => latest.onOpen?.())
          }
        }
      },
      handleDelegateClickContentCloser: (e: MouseEvent<HTMLElement>) => {
        const closer = findDelegateTarget<HTMLElement>(e, `.${DROPDOWN_CLOSER_CLASS_NAME}`)

        // HINT: Dropdownがネストしている場合、もっとも近いDropdownだけを閉じる
        if (closer?.closest(`.${DROPDOWN_CONTENT_CLASS_NAME}`) === e.currentTarget) {
          handleDelegateClickCloser()
        }
      },
    }
  }, [latest])

  // TODO: コンポーネントをFragmentでラップし、callbackRefとして設定するように修正
  useEffect(
    () => () => {
      latest.openFrame.cancel()
      latest.closeFrame.cancel()
    },
    [latest],
  )

  const baseTriggerLayoutEffectRef = useLayoutEffectRef(
    (node: HTMLElement | null) => {
      if (!node || !active) return

      const handleClickBody = (e: any) => {
        if (!latest.active || !node) {
          return
        }

        // ignore events from events within DropdownTrigger and DropdownContent
        const isClickedInTrigger = e.composedPath().includes(node)

        if (!isClickedInTrigger && !latest.isChildPortal(e.target)) {
          setActive(false)
          functions.actualClose()
        }
      }
      const updateTriggerRect = () => {
        if (node) {
          setTriggerRect(node.getBoundingClientRect())
        }
      }
      const listenerOption = { passive: true }

      document.body.addEventListener('click', handleClickBody, false)
      window.addEventListener('scroll', updateTriggerRect, listenerOption)
      window.addEventListener('resize', updateTriggerRect, listenerOption)

      return () => {
        document.body.removeEventListener('click', handleClickBody, false)
        window.removeEventListener('scroll', updateTriggerRect)
        window.removeEventListener('resize', updateTriggerRect)
      }
    },
    [active, functions, latest],
  )

  const triggerLayoutEffectRef = useMergeRefs(baseTriggerLayoutEffectRef, triggerElementRef)

  return (
    <PortalParentProvider>
      <DropdownContext.Provider
        value={{
          active,
          triggerRect,
          triggerElementRef,
          triggerLayoutEffectRef,
          contentCallbackRef,
          handleDelegateClickTrigger: functions.handleDelegateClickTrigger,
          handleDelegateClickContentCloser: functions.handleDelegateClickContentCloser,
          DropdownContentRoot: functions.DropdownContentRoot,
          contentId,
        }}
      >
        {children}
      </DropdownContext.Provider>
    </PortalParentProvider>
  )
}
