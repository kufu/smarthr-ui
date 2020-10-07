import React, {
  FC,
  MutableRefObject,
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { Rect, isEventFromChild } from './dropdownHelper'
import { usePortal } from '../../hooks/usePortal'

type Props = {
  children: ReactNode
}

type DropdownContextType = {
  active: boolean
  triggerRect: Rect
  triggerElementRef: MutableRefObject<HTMLDivElement | null>
  onClickTrigger: (rect: Rect) => void
  onClickCloser: () => void
  DropdownContentRoot: FC<{ children: ReactNode }>
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  triggerRect: initialRect,
  triggerElementRef: React.createRef(),
  onClickTrigger: () => {
    /* noop */
  },
  onClickCloser: () => {
    /* noop */
  },
  DropdownContentRoot: () => null,
})

export const Dropdown: FC<Props> = ({ children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const { portalRoot, isChildPortal, PortalParentProvider } = usePortal()

  const triggerElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickBody = (e: any) => {
      // ignore events from events within DropdownTrigger and DropdownContent
      if (isEventFromChild(e, triggerElementRef.current) || isChildPortal(e.target)) {
        return
      }
      setActive(false)
    }
    document.body.appendChild(portalRoot)
    document.body.addEventListener('click', onClickBody, false)

    return () => {
      document.body.removeChild(portalRoot)
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [isChildPortal, portalRoot])

  // This is the root container of a dropdown content located in outside the DOM tree
  const DropdownContentRoot = useMemo<FC<{ children: ReactNode }>>(
    () => (props) => {
      if (!active) return null
      return createPortal(props.children, portalRoot)
    },
    [active, portalRoot],
  )
  // set the displayName explicit for DevTools
  DropdownContentRoot.displayName = 'DropdownContentRoot'

  return (
    <PortalParentProvider>
      <DropdownContext.Provider
        value={{
          active,
          triggerRect,
          triggerElementRef,
          onClickTrigger: (rect) => {
            const newActive = !active
            setActive(newActive)
            if (newActive) setTriggerRect(rect)
          },
          onClickCloser: () => {
            setActive(false)
          },
          DropdownContentRoot,
        }}
      >
        {children}
      </DropdownContext.Provider>
    </PortalParentProvider>
  )
}
