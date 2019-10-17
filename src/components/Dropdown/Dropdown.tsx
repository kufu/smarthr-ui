import React, { useState, useEffect, useRef } from 'react'

import { Rect, hasParentElement } from './dropdownHelper'

type DropdownContextType = {
  element: HTMLElement | null
  active: boolean
  triggerRect: Rect
  onClickTrigger: (rect: Rect) => void
  onClickCloser: () => void
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = React.createContext<DropdownContextType>({
  element: null,
  active: false,
  triggerRect: initialRect,
  onClickTrigger: () => {},
  onClickCloser: () => {},
})

export const Dropdown: React.FC<{}> = ({ children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const element = useRef(document.createElement('div'))

  useEffect(() => {
    const onClickBody = (e: any) => {
      if (hasParentElement(e.target, element.current)) return
      setActive(false)
    }

    document.body.appendChild(element.current)
    document.body.addEventListener('click', onClickBody, false)

    return () => {
      document.body.removeChild(element.current)
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [])

  return (
    <DropdownContext.Provider
      value={{
        element: element.current,
        active,
        triggerRect,
        onClickTrigger: rect => {
          const newActive = !active
          setActive(newActive)
          if (newActive) setTriggerRect(rect)
        },
        onClickCloser: () => setActive(false),
      }}
    >
      {children}
    </DropdownContext.Provider>
  )
}
