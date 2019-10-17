import React, { useContext } from 'react'
import styled from 'styled-components'

import { DropdownContext } from './Dropdown'

export const DropdownTrigger: React.FC<{}> = ({ children }) => {
  const { key, active, onClickTrigger } = useContext(DropdownContext)

  return (
    <Wrapper
      className={`dropdown-trigger-${key}`}
      onClick={e => {
        const rect = e.currentTarget.getBoundingClientRect()
        onClickTrigger({
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        })
      }}
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
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-block;
`
