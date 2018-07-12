import * as React from 'react'
import * as PropTypes from 'prop-types'

import { CreatedTheme } from '../../styles/createTheme'
import { withStyles, InjectedProps } from '../../styles/withStyles'

const styles = (theme: CreatedTheme) => ({
  base: {
    display: 'inline-block',
    boxSizing: 'border-box',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '3px',
    border: '0 solid',
    borderLeftWidth: '10px',
    backgroundColor: theme.palette.white,
  },
  type: {
    success: {
      borderColor: theme.palette.success.primary,
      color: theme.palette.success.secondary,
    },
    info: {
      borderColor: theme.palette.info.primary,
      color: theme.palette.info.secondary,
    },
    warning: {
      borderColor: theme.palette.warning.primary,
      color: theme.palette.warning.secondary,
    },
    danger: {
      borderColor: theme.palette.danger.primary,
      color: theme.palette.danger.secondary,
    },
  },
  size: {
    s: {
      padding: '10px',
      fontSize: theme.typography.pxToRem(12),
    },
    m: {
      padding: '15px',
      fontSize: theme.typography.pxToRem(14),
    },
    l: {
      padding: '20px',
      fontSize: theme.typography.pxToRem(16),
    },
  },
})

interface Props extends React.Props<{}> {
  type: 'success' | 'info' | 'warning' | 'danger'
  size?: 's' | 'm' | 'l'
  wide?: boolean
  style?: {}
}

const Alert: React.SFC<Props & InjectedProps> = ({
  type,
  size = 'm',
  wide = false,
  themeStyle,
  style = {},
  children,
}) => {
  const createdStyle = {
    ...themeStyle.base,
    ...themeStyle.type[type],
    ...themeStyle.size[size],
    ...(wide ? { width: '100%' } : {}),
    ...style,
  }

  return <div style={createdStyle}>{children}</div>
}

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
  size: PropTypes.oneOf(['s', 'm', 'l']),
  wide: PropTypes.bool,
  themeStyle: PropTypes.object.isRequired,
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
}

export default withStyles(styles)(Alert)
