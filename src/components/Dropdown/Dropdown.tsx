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

import { Rect, hasParentElement } from './dropdownHelper'

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

  const portalElementRef = useRef(document.createElement('div'))
  const triggerElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickBody = (e: any) => {
      // ignore events from events within DropdownTrigger and DropdownContent
      if (
        e.target === triggerElementRef.current ||
        hasParentElement(e.target, portalElementRef.current)
      ) {
        return
      }
      setActive(false)
    }
    const portalElement = portalElementRef.current
    document.body.appendChild(portalElement)
    document.body.addEventListener('click', onClickBody, false)

    return () => {
      document.body.removeChild(portalElement)
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [])

  // This is the root container of a dropdown content located in outside the DOM tree
  const DropdownContentRoot = useMemo<FC<{ children: ReactNode }>>(
    () => (props) => {
      if (!active) return null
      return createPortal(props.children, portalElementRef.current)
    },
    [active],
  )
  // set the displayName explicit for DevTools
  DropdownContentRoot.displayName = 'DropdownContentRoot'

  return (
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
  )
}
