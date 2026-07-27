'use client'

import {
  type FC,
  type MutableRefObject,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useId,
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
  memoizedOnClickTrigger: (rect: Rect) => void
  onClickCloser: () => void
  DropdownContentRoot: FC<{ children: ReactNode }>
  contentId: string
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  triggerRect: initialRect,
  triggerElementRef: createRef(),
  rootTriggerRef: null,
  memoizedOnClickTrigger: () => {
    /* noop */
  },
  onClickCloser: () => {
    /* noop */
  },
  DropdownContentRoot: () => null,
  contentId: '',
})

export const Dropdown: FC<Props> = ({ onOpen, onClose, children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const { rootTriggerRef } = useContext(DropdownContext)
  const { createPortal, portalRoot, isPortalRootMounted, isChildPortal, PortalParentProvider } =
    usePortal()

  const triggerElementRef = useRef<HTMLDivElement>(null)
  const contentId = useId()

  const latest = useLatest({
    active,
    isPortalRootMounted,
    isChildPortal,
    portalRoot,
    onOpen,
    onClose,
    createPortal,
  })

  // This is the root container of a dropdown content located in outside the DOM tree
  const DropdownContentRoot = useCallback<FC<{ children: ReactNode }>>(
    (props) => (latest.active ? latest.createPortal(props.children) : null),
    [latest],
  )
  DropdownContentRoot.displayName = 'DropdownContentRoot'

  const memoizedOnClickTrigger = useCallback((rect: Rect) => {
    setActive((current) => {
      const newActive = !current

      if (newActive) {
        setTriggerRect(rect)
      }

      return newActive
    })
  }, [])

  const onClickCloser = useCallback(() => {
    setActive(false)

    // return focus to the Trigger
    getFirstTabbable(triggerElementRef)?.focus()
  }, [])

  useEffect(() => {
    if (latest.portalRoot) {
      latest.portalRoot.setAttribute('id', contentId)
    }

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
    if (latest.isPortalRootMounted()) {
      latest[active ? 'onOpen' : 'onClose']?.()
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
          memoizedOnClickTrigger,
          onClickCloser,
          DropdownContentRoot,
          contentId,
        }}
      >
        {children}
      </DropdownContext.Provider>
    </PortalParentProvider>
  )
}
