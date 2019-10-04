import React, { useContext, useEffect } from 'react'

import { DropdownContext } from './Dropdown'
import { useToggleContentView } from './DropdownContent'

export const DropdownControllableContent: React.FC<{}> = ({ children }) => {
  const { key, active, onClickCloser } = useContext(DropdownContext)

  useEffect(
    useToggleContentView(`dropdown-content-${key}`, `dropdown-trigger-${key}`)(
      active,
      children,
      onClickCloser,
    ),
    [active, children, key, onClickCloser],
  )

  return null
}
