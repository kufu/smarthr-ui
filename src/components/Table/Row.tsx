import * as React from 'react'
import styled from 'styled-components'
import { TableContext, tableSizes } from './Table'

const tableSizeToMarginMap = {
  [tableSizes.s]: 8,
  [tableSizes.m]: 12,
  [tableSizes.l]: 16,
}

const Row: React.FC<{}> = props => {
  const { size } = React.useContext(TableContext)
  return <Wrapper margin={tableSizeToMarginMap[size]}>{props.children}</Wrapper>
}

type WrapperProps = {
  margin: number
}
const Wrapper = styled.tr`
    margin-top: ${(props: WrapperProps) => `${props.margin}px`}
    margin-bottom: ${(props: WrapperProps) => `${props.margin}px`}
    :hover td {
        background-color: #f9f9f9;
    }
`

export default Row
