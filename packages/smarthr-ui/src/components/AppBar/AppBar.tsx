import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { withTheme, InjectedProps } from '../../hocs/withTheme'

type AppBarSize = 's' | 'm' | 'l'
interface Props extends React.Props<{}> {
  size?: AppBarSize
  style?: {}
}

const AppBar: React.SFC<Props & InjectedProps> = ({ size = 'm', theme, style = {}, children }) => (
  <Wrapper theme={theme} size={size} style={style}>
    {children && children}
  </Wrapper>
)

AppBar.propTypes = {
  size: PropTypes.oneOf(['s', 'm', 'l']),
  theme: PropTypes.object.isRequired,
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

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
    ${({ theme }: Styles) => theme.palette.primaryDark},
    ${({ theme }: Styles) => theme.palette.primaryLight}
  );
`
