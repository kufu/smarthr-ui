import React, { HTMLAttributes, VFC } from 'react'
import styled from 'styled-components'
import { TableGroupContext } from './Table'

type ElementType = HTMLAttributes<HTMLTableSectionElement>

export const Body: VFC<ElementType> = ({ children, ...props }) => (
  <Wrapper {...props}>
    <TableGroupContext.Provider value={{ group: 'body' }}>{children}</TableGroupContext.Provider>
  </Wrapper>
)

const Wrapper = styled.tbody`
  background-color: #fff;
`
