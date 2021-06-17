import React, { HTMLAttributes, VFC } from 'react'
import styled from 'styled-components'
import { TableGroupContext } from './Table'
import { useClassNames } from './useClassNames'

type ElementType = HTMLAttributes<HTMLTableSectionElement>

export const Body: VFC<ElementType> = ({ className = '', children, ...props }) => {
  const classNames = useClassNames().body
  return (
    <Wrapper {...props} className={`${className} ${classNames.wrapper}`}>
      <TableGroupContext.Provider value={{ group: 'body' }}>{children}</TableGroupContext.Provider>
    </Wrapper>
  )
}

const Wrapper = styled.tbody`
  background-color: #fff;
`
