import React, { useContext } from 'react'
import { createPortal } from 'react-dom'

import { DropdownContext } from './Dropdown'
import { DropdownContentInner } from './DropdownContentInner'
import { DropdownCloser } from './DropdownCloser'

export const DropdownContentContext = React.createContext<{
  onClickCloser: () => void
}>({
  onClickCloser: () => {},
})

type Props = {
  controllable?: boolean
}

export const DropdownContent: React.FC<Props> = ({ controllable = false, children }) => {
  const { element, active, triggerRect, onClickCloser } = useContext(DropdownContext)

  if (!active || !element) return null

  return createPortal(
    <DropdownContentContext.Provider value={{ onClickCloser }}>
      <DropdownContentInner triggerRect={triggerRect}>
        {controllable ? children : <DropdownCloser>{children}</DropdownCloser>}
      </DropdownContentInner>
    </DropdownContentContext.Provider>,
    element,
  )
}
