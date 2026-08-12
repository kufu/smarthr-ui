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

  // This is the root container of a dropdown content located in outside the DOM tree
  const DropdownContentRoot = useCallback<FC<{ children: ReactNode }>>(
    (props) => (latest.active ? latest.createPortal(props.children) : null),
    [latest],
  )
  DropdownContentRoot.displayName = 'DropdownContentRoot'

  const handleClickTrigger = useCallback(
    (rect: Rect) => {
      if (latest.active) {
        setActive(false)
        if (latest.onClose) requestAnimationFrame(() => latest.onClose?.())
      } else {
        setActive(true)
        setTriggerRect(rect)
        if (latest.onOpen) requestAnimationFrame(() => latest.onOpen?.())
      }
    },
    [latest],
  )

  const handleDelegateClickCloser = useCallback(() => {
    setActive(false)
    if (latest.onClose) requestAnimationFrame(() => latest.onClose?.())

    // return focus to the Trigger
    getFirstTabbable(triggerElementRef)?.focus()
  }, [latest])

  useEffect(() => {
    const onClickBody = (e: any) => {
      // ignore events from events within DropdownTrigger and DropdownContent
      if (!isEventFromChild(e, triggerElementRef.current) && !latest.isChildPortal(e.target)) {
        if (latest.active) {
          setActive(false)
          if (latest.onClose) requestAnimationFrame(() => latest.onClose?.())
        }
      }
    }

    document.body.addEventListener('click', onClickBody, false)

    return () => {
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [contentId, latest])

  return (
    <PortalParentProvider>
      <DropdownContext.Provider
        value={{
          active,
          triggerRect,
          triggerElementRef,
          rootTriggerRef: rootTriggerRef || triggerElementRef || null,
          handleClickTrigger,
          handleDelegateClickCloser,
          DropdownContentRoot,
          contentId,
        }}
      >
        {children}
      </DropdownContext.Provider>
    </PortalParentProvider>
  )
}
