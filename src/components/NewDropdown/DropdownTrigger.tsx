import React, { useContext } from 'react'

import { DropdownContext } from './Dropdown'

export const DropdownTrigger: React.FC<{}> = ({ children }) => {
  const { key, active, onClickTrigger } = useContext(DropdownContext)

  return (
    <div
      onClick={e => {
        const rect = e.currentTarget.getBoundingClientRect()
        onClickTrigger({
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        })
      }}
      className={`dropdown-trigger-${key}`}
    >
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
