import React, { useContext } from 'react'
import styled from 'styled-components'

import { DropdownContext } from './Dropdown'

type Props = {
  children: React.ReactNode
  className?: string
}

export const DropdownTrigger: React.FC<Props> = ({ children, className = '' }) => {
  const { active, onClickTrigger, triggerElementRef } = useContext(DropdownContext)

  return (
    <Wrapper
      ref={triggerElementRef}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        onClickTrigger({
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        })
        e.stopPropagation()
      }}
      className={className}
    >
      {React.Children.map(children, (child: any) => {
        const props = child.props ? child.props : {}
        const { className: classNameProps = '' } = props

        switch (typeof child) {
          case 'string':
            return child

          case 'object':
            return React.cloneElement(child, {
              className: `${active ? 'active' : ''} ${classNameProps}`,
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
