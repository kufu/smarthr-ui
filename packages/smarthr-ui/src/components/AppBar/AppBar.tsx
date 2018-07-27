import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { extendDefaultPropTypes } from '../../libs/propTypes'
import { withTheme, InjectedProps } from '../../hocs/withTheme'

type AppBarSize = 's' | 'm' | 'l'
interface Props extends React.Props<{}> {
  size?: AppBarSize
  style?: {}
}
type MergedProps = Props & InjectedProps

const AppBar: React.SFC<MergedProps> = ({ size = 'm', theme, style = {}, children }) => (
  <Wrapper theme={theme} size={size} style={style}>
    {children && children}
  </Wrapper>
)

AppBar.propTypes = extendDefaultPropTypes<MergedProps>({
  size: PropTypes.oneOf(['s', 'm', 'l']),
})

export default withTheme(AppBar)

interface Styles extends InjectedProps {
  size: AppBarSize
}
const sizeMap = {
  s: '0 10px',
  m: '0 15px',
  l: '0 20px',
}
const Wrapper = styled.div`
  padding: ${({ size }: Styles) => sizeMap[size]};
  background: linear-gradient(
    to right top,
    ${({ theme }: Styles) => theme.palette.primary},
    ${({ theme }: Styles) => theme.palette.primary}
  );
`
