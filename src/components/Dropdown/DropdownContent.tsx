import React, { useContext } from 'react'

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
  className?: string
}

export const DropdownContent: React.FC<Props> = ({
  controllable = false,
  className = '',
  children,
}) => {
  const { dropdownKey, DropdownContentRoot, triggerRect, onClickCloser } = useContext(
    DropdownContext,
  )

  return (
    <DropdownContentRoot>
      <DropdownContentContext.Provider value={{ onClickCloser }}>
        <DropdownContentInner triggerRect={triggerRect} className={`${dropdownKey} ${className}`}>
          {controllable ? children : <DropdownCloser>{children}</DropdownCloser>}
        </DropdownContentInner>
      </DropdownContentContext.Provider>
    </DropdownContentRoot>
  )
}
