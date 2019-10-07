import React, { useContext, useEffect } from 'react'

import { DropdownContext } from './Dropdown'
import { toggleContentView } from './DropdownContent'

export const DropdownControllableContent: React.FC<{}> = ({ children }) => {
  const { key, active, triggerRect, onClickCloser } = useContext(DropdownContext)

  useEffect(
    toggleContentView(`dropdown-content-${key}`, `dropdown-trigger-${key}`)(
      active,
      triggerRect,
      children,
      onClickCloser,
    ),
    [active, children, key, onClickCloser],
  )

  return null
}
