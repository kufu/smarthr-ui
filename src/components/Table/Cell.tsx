import * as React from 'react'
import styled from 'styled-components'

import { TableGroupContext } from './Table'

const Cell: React.FC<{}> = props => {
  const { group } = React.useContext(TableGroupContext)
  const WrapComponent = (tableGroup => {
    switch (tableGroup) {
      case 'body':
        return Td
      case 'head':
        return Th
    }
  })(group)
  return <WrapComponent>{props.children}</WrapComponent>
}

const Td = styled.td``

const Th = styled.th``

export default Cell
