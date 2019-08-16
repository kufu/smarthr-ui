import * as React from 'react'
import styled from 'styled-components'
import { TableGroupContext } from './Table'

const Body: React.FC<{}> = props => {
  return (
    <Wrapper>
      <TableGroupContext.Provider value={{ group: 'body' }}>
        {props.children}
      </TableGroupContext.Provider>
    </Wrapper>
  )
}

const Wrapper = styled.tbody``

export default Body
