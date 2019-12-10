import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { Rect, hasParentElement } from './dropdownHelper'

type Props = {
  children: React.ReactNode
  className?: string
}

type DropdownContextType = {
  active: boolean
  triggerRect: Rect
  onClickTrigger: (rect: Rect) => void
  onClickCloser: () => void
  DropdownContentRoot: React.FC<{ children: React.ReactNode }>
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = React.createContext<DropdownContextType>({
  active: false,
  triggerRect: initialRect,
  onClickTrigger: () => {},
  onClickCloser: () => {},
  DropdownContentRoot: () => null,
})

export const Dropdown: React.FC<Props> = ({ children, className = '' }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    const onClickBody = (e: any) => {
      if (hasParentElement(e.target, element)) return
      setActive(false)
    }

    document.body.appendChild(element)
    document.body.addEventListener('click', onClickBody, false)

    return () => {
      document.body.removeChild(element)
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [element])

  // This is the root container of a dropdown content located in outside the DOM tree
  const DropdownContentRoot = useMemo<React.FC<{ children: React.ReactNode }>>(
    () => props => {
      if (!active) return null
      return createPortal(props.children, element)
    },
    [active, element],
  )
  // set the displayName explicit for DevTools
  DropdownContentRoot.displayName = 'DropdownContentRoot'

  return (
    <DropdownContext.Provider
      value={{
        active,
        triggerRect,
        onClickTrigger: rect => {
          const newActive = !active
          setActive(newActive)
          if (newActive) setTriggerRect(rect)
        },
        onClickCloser: () => setActive(false),
        DropdownContentRoot,
      }}
    >
      <div className={className}>{children}</div>
    </DropdownContext.Provider>
  )
}
