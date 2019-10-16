import React, { useContext, useEffect } from 'react'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { DropdownContext } from './Dropdown'
import { toggleContentView } from './DropdownContent'

const DropdownControllableContentComponent: React.FC<
  { children: React.ReactNode } & InjectedProps
> = ({ theme, children }) => {
  const { key, active, triggerRect, onClickCloser } = useContext(DropdownContext)

  useEffect(
    toggleContentView(`dropdown-content-${key}`, `dropdown-trigger-${key}`)(
      active,
      triggerRect,
      children,
      theme,
      onClickCloser,
    ),
    [active, children, key, onClickCloser],
  )

  return null
}

export const DropdownControllableContent = withTheme(DropdownControllableContentComponent)
