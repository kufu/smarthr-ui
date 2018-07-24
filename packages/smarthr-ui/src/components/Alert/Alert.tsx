import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { withTheme, InjectedProps } from '../../hocs/withTheme'

type AlertType = 'success' | 'info' | 'warning' | 'danger'
type AlertSize = 's' | 'm' | 'l'
interface Props extends React.Props<{}> {
  type: AlertType
  size?: AlertSize
  wide?: boolean
  style?: {}
}

const Alert: React.SFC<Props & InjectedProps> = ({
  theme,
  type,
  size = 'm',
  wide = false,
  style = {},
  children,
}) => (
  <Wrapper theme={theme} type={type} size={size} wide={wide} style={style}>
    {children}
  </Wrapper>
)

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
  size: PropTypes.oneOf(['s', 'm', 'l']),
  wide: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default withTheme(Alert)

interface Styles extends InjectedProps {
  type: AlertType
  size: AlertSize
  wide: boolean
}
const sizeMap = {
  s: {
    padding: '10px',
    fontSize: 12,
  },
  m: {
    padding: '15px',
    fontSize: 14,
  },
  l: {
    padding: '20px',
    fontSize: 16,
  },
}
const Wrapper = styled.div`
  display: inline-block;
  box-sizing: border-box;
  width: ${({ wide }: Styles) => (wide ? '100%;' : 'auto')};
  padding: ${({ size }: Styles) => sizeMap[size].padding};
  border-radius: 3px;
  border: 0 solid;
  border-left-width: 10px;
  border-color: ${({ theme, type }: Styles) => theme.palette[type].primary};
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }: Styles) => theme.palette.white};
  color: ${({ theme, type }: Styles) => theme.palette[type].secondary};
  font-size: ${({ theme, size }: Styles) => theme.typography.pxToRem(sizeMap[size].fontSize)};
`
