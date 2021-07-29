import React, { useContext } from 'react'

import { DropdownContext } from './Dropdown'
import { DropdownContentInner } from './DropdownContentInner'
import { useClassNames } from './useClassNames'

export const DropdownContentContext = React.createContext<{
  onClickCloser: () => void
  controllable: boolean
  scrollable: boolean
}>({
  onClickCloser: () => {
    /* noop */
  },
  controllable: false,
  scrollable: true,
})

type Props = {
  controllable?: boolean
  scrollable?: boolean
  className?: string
  children?: React.ReactNode
}

export const DropdownContent: React.VFC<Props> = ({
  controllable = false,
  scrollable = true,
  className = '',
  children,
}) => {
  const { DropdownContentRoot, triggerRect, onClickCloser } = useContext(DropdownContext)
  const classNames = useClassNames()

  return (
    <DropdownContentRoot>
      <DropdownContentContext.Provider value={{ onClickCloser, controllable, scrollable }}>
        <DropdownContentInner
          triggerRect={triggerRect}
          scrollable={scrollable}
          className={`${className} ${classNames.content}`}
          controllable={controllable}
        >
          {children}
        </DropdownContentInner>
      </DropdownContentContext.Provider>
    </DropdownContentRoot>
  )
}
