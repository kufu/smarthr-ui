import React, { useContext, useEffect } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

import { DropdownContext } from './Dropdown'

type DropdownContentContextType = {
  onClickCloser: () => void
}

export const DropdownContentContext = React.createContext<DropdownContentContextType>({
  onClickCloser: () => {},
})

export const useToggleContentView = (className: string, additionalClassName?: string) => (
  active: boolean,
  children: React.ReactNode,
  onClickCloser: () => void,
) => () => {
  if (active) {
    const element = document.createElement('div')
    let classNames = className
    if (additionalClassName) classNames += ` ${additionalClassName}`
    element.className = classNames
    render(
      <DropdownContentContext.Provider value={{ onClickCloser }}>
        <Wrapper>{children}</Wrapper>
      </DropdownContentContext.Provider>,
      document.body.appendChild(element),
    )
  } else {
    const element = document.querySelector(`.${className}`)
    if (element) document.body.removeChild(element)
  }
}

export const DropdownContent: React.FC<{}> = ({ children }) => {
  const { key, active, onClickCloser } = useContext(DropdownContext)

  useEffect(useToggleContentView(`dropdown-content-${key}`)(active, children, onClickCloser), [
    active,
    children,
    key,
    onClickCloser,
  ])

  return null
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12);
  background-color: #fff;
  white-space: nowrap;
`
