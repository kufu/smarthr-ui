import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { extendDefaultPropTypes } from '../../libs/propTypes'

interface Props extends React.Props<{}> {
  align?: 'left' | 'center' | 'right'
  style?: {}
}

const TableRow: React.SFC<Props> = ({ align = 'left', style = {}, children }) => (
  <Wrapper align={align} style={style}>
    {children}
  </Wrapper>
)

TableRow.propTypes = extendDefaultPropTypes<Props>({
  align: PropTypes.oneOf(['left', 'center', 'right']),
})

export default TableRow

interface Styles {
  align: string
}
const Wrapper = styled.tr`
  text-align: ${({ align }: Styles) => align};
`
