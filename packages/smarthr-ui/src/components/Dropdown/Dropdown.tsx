'use client'

import {
  type FC,
  type MutableRefObject,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useLatest } from '../../hooks/useLatest'
import { usePortal } from '../../hooks/usePortal'

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
  handleClickTrigger: (rect: Rect) => void
  handleDelegateClickCloser: () => void
  DropdownContentRoot: FC<{ children: ReactNode }>
  contentId: string
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  triggerRect: initialRect,
  triggerElementRef: createRef(),
  rootTriggerRef: null,
  handleClickTrigger: () => {
    /* noop */
  },
  handleDelegateClickCloser: () => {
    /* noop */
  },
  DropdownContentRoot: () => null,
  contentId: '',
})

export const Dropdown: FC<Props> = ({ onOpen, onClose, children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const { rootTriggerRef } = useContext(DropdownContext)

  const contentId = useId()
  const { createPortal, portalRoot, isChildPortal, PortalParentProvider } = usePortal({
    rootId: contentId,
  })

  const triggerElementRef = useRef<HTMLDivElement>(null)

  const latest = useLatest({
    active,
    isChildPortal,
    portalRoot,
    onOpen,
    onClose,
    createPortal,
  })

  const functions = useMemo(() => {
    // This is the root container of a dropdown content located in outside the DOM tree
    const DropdownContentRoot: FC<{ children: ReactNode }> = (props) =>
      latest.active ? latest.createPortal(props.children) : null
    DropdownContentRoot.displayName = 'DropdownContentRoot'

    return {
      DropdownContentRoot,
      handleClickTrigger: (rect: Rect) => {
        setActive((current) => {
          const newActive = !current

          if (newActive) {
            setTriggerRect(rect)
          }

          return newActive
        })
      },
      handleDelegateClickCloser: () => {
        setActive(false)

        // return focus to the Trigger
        getFirstTabbable(triggerElementRef)?.focus()
      },
    }
  }, [latest])

  useEffect(() => {
    const onClickBody = (e: any) => {
      // ignore events from events within DropdownTrigger and DropdownContent
      if (!isEventFromChild(e, triggerElementRef.current) && !latest.isChildPortal(e.target)) {
        setActive(false)
      }
    }

    document.body.addEventListener('click', onClickBody, false)

    return () => {
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [contentId, latest])

  useEffect(() => {
    if (latest.portalRoot) {
      latest[active ? 'onOpen' : 'onClose']?.()
    }

    if (!active) return

    const updateTriggerRect = () => {
      if (triggerElementRef.current) {
        setTriggerRect(triggerElementRef.current.getBoundingClientRect())
      }
    }

    const scrollOption = { capture: true, passive: true }

    window.addEventListener('scroll', updateTriggerRect, scrollOption)
    window.addEventListener('resize', updateTriggerRect, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateTriggerRect, scrollOption)
      window.removeEventListener('resize', updateTriggerRect)
    }
  }, [active, latest])

  return (
    <PortalParentProvider>
      <DropdownContext.Provider
        value={{
          active,
          triggerRect,
          triggerElementRef,
          rootTriggerRef: rootTriggerRef || triggerElementRef || null,
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
