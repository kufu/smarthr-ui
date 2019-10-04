import React, { useState, useEffect } from 'react'

import { Rect, getRandomStr, getParentElementByClassNameRecursively } from './dropdownHelper'

type DropdownContextType = {
  key: string
  active: boolean
  triggerRect: Rect
  onClickTrigger: (rect: Rect) => void
  onClickCloser: () => void
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = React.createContext<DropdownContextType>({
  key: '',
  active: false,
  triggerRect: initialRect,
  onClickTrigger: () => {},
  onClickCloser: () => {},
})

export const Dropdown: React.FC<{}> = ({ children }) => {
  const [key, setKey] = useState('')
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  useEffect(() => {
    const newKey = getRandomStr()
    const onClickBody = (e: any) => {
      if (getParentElementByClassNameRecursively(e.target, `dropdown-trigger-${newKey}`)) return
      setActive(false)
    }

    setKey(newKey)
    document.body.addEventListener('click', onClickBody, false)

    return () => {
      const element = document.querySelector(`.dropdown-content-${newKey}`)
      if (element) document.body.removeChild(element)
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [])

  return (
    <DropdownContext.Provider
      value={{
        key,
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
