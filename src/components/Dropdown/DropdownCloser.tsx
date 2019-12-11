import React, { useContext } from 'react'

import { DropdownContext } from './Dropdown'
import { DropdownContentContext } from './DropdownContent'

type Props = {
  children: React.ReactNode
  className?: string
}

export const DropdownCloser: React.FC<Props> = ({ children, className = '' }) => {
  const { dropdownKey } = useContext(DropdownContext)
  const { onClickCloser } = useContext(DropdownContentContext)

  return (
    <div className={`${dropdownKey} ${className}`} onClick={onClickCloser}>
      {children}
    </div>
  )
}
