import React, { useState, useEffect } from 'react'

import { getRandomStr, getParentElementByClassNameRecursively } from './helper'

// export type Rect = {
//   top: number
//   right: number
//   bottom: number
//   left: number
// }

export type CustomEvent = {
  target: any
  stopPropagation: () => void
}

type DropdownContextType = {
  key: string
  active: boolean
  onClickTrigger: () => void
  onClickCloser: () => void
}

export const DropdownContext = React.createContext<DropdownContextType>({
  key: '',
  active: false,
  onClickTrigger: () => {},
  onClickCloser: () => {},
})

export const Dropdown: React.FC<{}> = ({ children }) => {
  const [key, setKey] = useState('')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const newKey = getRandomStr()
    const onClickBody = (e: CustomEvent) => {
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
        onClickTrigger: () => setActive(!active),
        onClickCloser: () => {
          console.log('------------onClickCloser-------------')
          setActive(false)
        },
      }}
    >
      {children}
    </DropdownContext.Provider>
  )
}
