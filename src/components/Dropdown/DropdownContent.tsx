import React, { useContext } from 'react'
import { createPortal } from 'react-dom'

import { DropdownContext } from './Dropdown'
import { DropdownContentInner } from './DropdownContentInner'

export const DropdownContentContext = React.createContext<{
  onClickCloser: () => void
}>({
  onClickCloser: () => {},
})

export function createElement(tagName: string, className: string) {
  const element = document.createElement(tagName)
  element.className = className
  return element
}

type Props = {
  controllable?: boolean
}

export const DropdownContent: React.FC<Props> = ({ controllable = false, children }) => {
  const { key, active, triggerRect, onClickCloser } = useContext(DropdownContext)

  if (!active) return null

  const contentClassName = `dropdown-content-${key}`
  let element = document.querySelector(`.${contentClassName}`)

  if (!element) {
    element = createElement(
      'div',
      `${contentClassName} ${controllable ? `dropdown-trigger-${key}` : ''}`,
    )
    document.body.appendChild(element)
  }

  return createPortal(
    <DropdownContentContext.Provider value={{ onClickCloser }}>
      <DropdownContentInner triggerRect={triggerRect}>{children}</DropdownContentInner>
    </DropdownContentContext.Provider>,
    element,
  )
}
