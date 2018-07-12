import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { color, typography } from '../../styles'

const Alert: React.SFC<Props> = ({ type, size, wide, style, children }) => {
  const styles = {
    ...typeStyle[type],
    ...(wide ? { width: '100%' } : {}),
    ...style,
  }
  const Wrapper = (() => {
    if (size === 's') return Small
    if (size === 'm') return Medium
    if (size === 'l') return Large
    return Medium
  })()

  return <Wrapper style={styles}>{children}</Wrapper>
}

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
  size: PropTypes.oneOf(['s', 'm', 'l']),
  wide: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
}

Alert.defaultProps = {
  size: 'm',
  wide: false,
  style: {},
}

export default Alert

interface Props extends React.Props<{}> {
  type: 'success' | 'info' | 'warning' | 'danger'
  size?: 's' | 'm' | 'l'
  wide?: boolean
  style?: {}
}

const typeStyle = {
  success: {
    borderColor: color.success.primary,
    color: color.success.secondary,
  },
  info: {
    borderColor: color.info.primary,
    color: color.info.secondary,
  },
  warning: {
    borderColor: color.warning.primary,
    color: color.warning.secondary,
  },
  danger: {
    borderColor: color.danger.primary,
    color: color.danger.secondary,
  },
}

const Base = styled.div`
  display: inline-block;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  border: 0 solid;
  border-left-width: 10px;
  background-color: ${color.white};
`
const Small = Base.extend`
  padding: 10px;
  font-size: ${typography.pxToRem(14)};
`
const Medium = Base.extend`
  padding: 15px;
  font-size: ${typography.pxToRem(16)};
`
const Large = Base.extend`
  padding: 20px;
  font-size: ${typography.pxToRem(18)};
`
