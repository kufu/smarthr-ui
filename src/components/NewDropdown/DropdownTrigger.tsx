import React, { useContext } from 'react'

import { CustomEvent, DropdownContext } from './Dropdown'

export const DropdownTrigger: React.FC<{}> = ({ children }) => {
  const { key, active, onClickTrigger } = useContext(DropdownContext)
  const onClick = (e: CustomEvent) => {
    e.stopPropagation()
    onClickTrigger()
  }

  return (
    <div onClick={onClick} className={`dropdown-trigger-${key}`}>
      {React.Children.map(children, (child: any) => {
        const props = child.props ? child.props : {}
        const { className = '' } = props

        switch (typeof child) {
          case 'string':
            return child

          case 'object':
            return React.cloneElement(child, {
              className: `${active ? 'active' : ''} ${className}`,
            })

          default:
            return null
        }
      })}
    </div>
  )
}
