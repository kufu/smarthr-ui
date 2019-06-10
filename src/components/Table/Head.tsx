import * as React from 'react'
import styled from 'styled-components'
import { TableGroupContext } from './Table'

const Head: React.FC<{}> = props => {
  return (
    <Wrapper>
      <TableGroupContext.Provider value={{ group: 'head' }}>
        {props.children}
      </TableGroupContext.Provider>
    </Wrapper>
  )
}

const Wrapper = styled.thead``

export default Head
