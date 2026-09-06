'use client'

import {
  type FC,
  type MutableRefObject,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createRef,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useAnimationFrame } from '../../hooks/client/useAnimationFrame'
import { usePortal } from '../../hooks/client/usePortal'
import { useLatest } from '../../hooks/useLatest'

import { type Rect, getFirstTabbable, isEventFromChild } from './dropdownHelper'

type Props = PropsWithChildren<{
  onOpen?: () => void
  onClose?: () => void
}>

type DropdownContextType = {
  active: boolean
  triggerRect: Rect
  triggerElementRef: MutableRefObject<HTMLDivElement | null>
  rootTriggerRef: MutableRefObject<HTMLDivElement | null> | null
  contentInnerCallbackRef: (node: HTMLElement | null) => (() => void) | undefined
  cleanupFrame: () => void
  handleClickTrigger: (rect: Rect) => void
  handleDelegateClickCloser: () => void
  DropdownContentRoot: FC<{ children: ReactNode }>
  contentId: string
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

const NOOP = () => null
export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  triggerRect: initialRect,
  triggerElementRef: createRef(),
  rootTriggerRef: null,
  contentInnerCallbackRef: () => undefined,
  cleanupFrame: NOOP,
  handleClickTrigger: NOOP,
  handleDelegateClickCloser: NOOP,
  DropdownContentRoot: NOOP,
  contentId: '',
})

export const Dropdown: FC<Props> = ({ onOpen, onClose, children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const { rootTriggerRef } = useContext(DropdownContext)

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
    // This is the root container of a dropdown content located in outside the DOM tree
    const DropdownContentRoot: FC<{ children: ReactNode }> = (props) =>
      latest.active ? latest.createPortal(props.children) : null
    DropdownContentRoot.displayName = 'DropdownContentRoot'
    const actualClose = () => {
      if (latest.onClose) {
        latest.closeFrame.request(() => latest.onClose?.())
      }
    }

    const handleClickBody = (e: any) => {
      // ignore events from events within DropdownTrigger and DropdownContent
      if (
        latest.active &&
        !isEventFromChild(e, triggerElementRef.current) &&
        !latest.isChildPortal(e.target)
      ) {
        setActive(false)
        actualClose()
      }
    }

    const updateTriggerRect = () => {
      if (triggerElementRef.current) {
        setTriggerRect(triggerElementRef.current.getBoundingClientRect())
      }
    }

    return {
      DropdownContentRoot,
      cleanupFrame: () => {
        latest.openFrame.cancel()
        latest.closeFrame.cancel()
      },
      contentInnerCallbackRef: (node: HTMLElement | null) => {
        if (!node) {
          return
        }

        document.body.addEventListener('click', handleClickBody, false)
        window.addEventListener('scroll', updateTriggerRect, { passive: true })
        window.addEventListener('resize', updateTriggerRect, { passive: true })

        return () => {
          document.body.removeEventListener('click', handleClickBody, false)
          window.removeEventListener('scroll', updateTriggerRect)
          window.removeEventListener('resize', updateTriggerRect)
        }
      },
      handleClickTrigger: (rect: Rect) => {
        if (latest.active) {
          setActive(false)
          actualClose()
        } else {
          setActive(true)
          setTriggerRect(rect)

          if (latest.onOpen) {
            latest.openFrame.request(() => latest.onOpen?.())
          }
        }
      },
      handleDelegateClickCloser: () => {
        setActive(false)
        actualClose()

        // return focus to the Trigger
        getFirstTabbable(triggerElementRef)?.focus()
      },
    }
  }, [latest])

  return (
    <PortalParentProvider>
      <DropdownContext.Provider
        value={{
          active,
          triggerRect,
          triggerElementRef,
          rootTriggerRef: rootTriggerRef || triggerElementRef || null,
          contentInnerCallbackRef: functions.contentInnerCallbackRef,
          cleanupFrame: functions.cleanupFrame,
          handleClickTrigger: functions.handleClickTrigger,
          handleDelegateClickCloser: functions.handleDelegateClickCloser,
          DropdownContentRoot: functions.DropdownContentRoot,
          contentId,
        }}
      >
        {children}
      </DropdownContext.Provider>
    </PortalParentProvider>
  )
}
