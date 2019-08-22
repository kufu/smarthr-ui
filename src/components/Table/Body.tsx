import * as React from 'react'
import styled from 'styled-components'
import { TableGroupContext } from './Table'

export const Body: React.FC<{}> = props => {
  return (
    <Wrapper {...props}>
      <TableGroupContext.Provider value={{ group: 'body' }}>
        {props.children}
      </TableGroupContext.Provider>
    </Wrapper>
  )
}

const Wrapper = styled.tbody`
  background-color: #fff;
`
