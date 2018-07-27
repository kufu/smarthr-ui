import * as React from 'react'
import styled from 'styled-components'

import { extendDefaultPropTypes } from '../../libs/propTypes'

interface Props extends React.Props<{}> {
  style?: {}
}
const Paper: React.SFC<Props> = ({ style = {}, children }) => (
  <Wrapper style={style}>{children}</Wrapper>
)

Paper.propTypes = extendDefaultPropTypes<Props>({})

export default Paper

const Wrapper = styled.div`
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
`
