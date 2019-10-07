import React, { useContext, useEffect } from 'react'
import { render } from 'react-dom'

import { Rect } from './dropdownHelper'
import { DropdownContext } from './Dropdown'
import { DropdownContentInner } from './DropdownContentInner'

type DropdownContentContextType = {
  onClickCloser: () => void
}

export const DropdownContentContext = React.createContext<DropdownContentContextType>({
  onClickCloser: () => {},
})

export const toggleContentView = (className: string, additionalClassName?: string) => (
  active: boolean,
  triggerRect: Rect,
  children: React.ReactNode,
  onClickCloser: () => void,
) => () => {
  if (active) {
    const element = document.createElement('div')
    let classNames = className
    if (additionalClassName) classNames += ` ${additionalClassName}`
    element.className = classNames
    render(
      <DropdownContentContext.Provider value={{ onClickCloser }}>
        <DropdownContentInner triggerRect={triggerRect}>{children}</DropdownContentInner>
      </DropdownContentContext.Provider>,
      document.body.appendChild(element),
    )
  } else {
    const element = document.querySelector(`.${className}`)
    if (element) document.body.removeChild(element)
  }
}

export const DropdownContent: React.FC<{}> = ({ children }) => {
  const { key, active, triggerRect, onClickCloser } = useContext(DropdownContext)

  useEffect(
    toggleContentView(`dropdown-content-${key}`)(active, triggerRect, children, onClickCloser),
    [active, children, key, onClickCloser],
  )

  return null
}
