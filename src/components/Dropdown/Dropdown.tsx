import React, { FC, ReactNode, createContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Rect, getRandomStr, includeDropdownElement } from './dropdownHelper'

type Props = {
  children: ReactNode
}

type DropdownContextType = {
  dropdownKey: string
  active: boolean
  triggerRect: Rect
  onClickTrigger: (rect: Rect) => void
  onClickCloser: () => void
  DropdownContentRoot: FC<{ children: ReactNode }>
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = createContext<DropdownContextType>({
  dropdownKey: '',
  active: false,
  triggerRect: initialRect,
  onClickTrigger: () => undefined,
  onClickCloser: () => undefined,
  DropdownContentRoot: () => null,
})

export const Dropdown: FC<Props> = ({ children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)
  const [dropdownKey] = useState(getRandomStr())

  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    const onClickBody = (e: any) => {
      if (includeDropdownElement(e.target, `dropdown-${dropdownKey}`)) return
      setActive(false)
    }

    document.body.appendChild(element)
    document.body.addEventListener('click', onClickBody, false)

    return () => {
      document.body.removeChild(element)
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [dropdownKey, element])

  // This is the root container of a dropdown content located in outside the DOM tree
  const DropdownContentRoot = useMemo<FC<{ children: ReactNode }>>(
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
        dropdownKey: `dropdown-${dropdownKey}`,
        active,
        triggerRect,
        onClickTrigger: rect => {
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
