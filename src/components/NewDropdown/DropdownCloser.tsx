import React, { useContext } from 'react'

import { DropdownContentContext } from './DropdownContent'

export const DropdownCloser: React.FC<{}> = ({ children }) => {
  const { onClickCloser } = useContext(DropdownContentContext)
  return <div onClick={onClickCloser}>{children}</div>
}
