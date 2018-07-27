import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { extendDefaultPropTypes } from '../../libs/propTypes'

interface Props extends React.Props<{}> {
  radius?: number
  style?: {}
}
const Paper: React.SFC<Props> = ({ radius = 4, style = {}, children }) => (
  <Wrapper radius={radius} style={style}>
    {children}
  </Wrapper>
)

Paper.propTypes = extendDefaultPropTypes<Props>({
  radius: PropTypes.number,
})

export default Paper

interface Styles {
  radius: number
}
const Wrapper = styled.div`
  border-radius: ${({ radius }: Styles) => radius}px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
`
