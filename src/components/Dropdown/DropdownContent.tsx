import React, { useContext, useEffect } from 'react'
import { render } from 'react-dom'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { ThemeProvider } from '../../themes/ThemeProvider'
import { Rect } from './dropdownHelper'
import { DropdownContext } from './Dropdown'
import { DropdownContentInner } from './DropdownContentInner'

type DropdownContentContextType = {
  onClickCloser: () => void
}

export const DropdownContentContext = React.createContext<DropdownContentContextType>({
  onClickCloser: () => {},
})

export const toggleContentView = (className: string, additionalClassName?: string) => (
  active: boolean,
  triggerRect: Rect,
  children: React.ReactNode,
  theme: InjectedProps['theme'],
  onClickCloser: () => void,
) => () => {
  if (active) {
    const element = document.createElement('div')
    let classNames = className
    if (additionalClassName) classNames += ` ${additionalClassName}`
    element.className = classNames
    render(
      <ThemeProvider theme={theme}>
        <DropdownContentContext.Provider value={{ onClickCloser }}>
          <DropdownContentInner triggerRect={triggerRect}>{children}</DropdownContentInner>
        </DropdownContentContext.Provider>
      </ThemeProvider>,
      document.body.appendChild(element),
    )
  } else {
    const element = document.querySelector(`.${className}`)
    if (element) document.body.removeChild(element)
  }
}

const DropdownContentComponent: React.FC<{ children: React.ReactNode } & InjectedProps> = ({
  theme,
  children,
}) => {
  const { key, active, triggerRect, onClickCloser } = useContext(DropdownContext)

  useEffect(
    toggleContentView(`dropdown-content-${key}`)(
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

export const DropdownContent = withTheme(DropdownContentComponent)
