import React, { useContext } from 'react'
import { createPortal } from 'react-dom'

import { DropdownContext } from './Dropdown'
import { DropdownContentContext, createElement } from './DropdownContent'
import { DropdownContentInner } from './DropdownContentInner'

export const DropdownControllableContent: React.FC<{}> = ({ children }) => {
  const { key, active, triggerRect, onClickCloser } = useContext(DropdownContext)

  if (!active) return null

  let element = document.querySelector(`.dropdown-content-${key}`)

  if (!element) {
    element = createElement('div', `dropdown-content-${key} dropdown-trigger-${key}`)
    document.body.appendChild(element)
  }

  return createPortal(
    <DropdownContentContext.Provider value={{ onClickCloser }}>
      <DropdownContentInner triggerRect={triggerRect}>{children}</DropdownContentInner>
    </DropdownContentContext.Provider>,
    element,
  )
}
