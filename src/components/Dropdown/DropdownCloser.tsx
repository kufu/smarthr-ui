import React, { useContext } from 'react'

import { DropdownContentContext } from './DropdownContent'

type Props = {
  children: React.ReactNode
  className?: string
}

export const DropdownCloser: React.FC<Props> = ({ children, className = '' }) => {
  const { onClickCloser } = useContext(DropdownContentContext)
  return (
    <div className={className} onClick={onClickCloser}>
      {children}
    </div>
  )
}
