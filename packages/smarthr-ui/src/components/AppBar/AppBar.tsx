import * as React from 'react'
import * as PropTypes from 'prop-types'

import { CreatedTheme } from '../../styles/createTheme'
import { withStyles, InjectedProps } from '../../styles/withStyles'

const styles = (theme: CreatedTheme) => ({
  base: {
    backgroundColor: theme.palette.primary,
  },
  size: {
    s: {
      paddingRight: '10px',
      paddingLeft: '10px',
    },
    m: {
      paddingRight: '15px',
      paddingLeft: '15px',
    },
    l: {
      paddingRight: '20px',
      paddingLeft: '20px',
    },
  },
})

interface Props extends React.Props<{}> {
  size?: 's' | 'm' | 'l'
  style?: {}
}

const AppBar: React.SFC<Props & InjectedProps> = ({
  size = 'm',
  themeStyle,
  style = {},
  children,
}) => {
  const createdStyle = {
    ...themeStyle.base,
    ...themeStyle.size[size],
    ...style,
  }

  return <div style={createdStyle}>{children && children}</div>
}

AppBar.propTypes = {
  size: PropTypes.oneOf(['s', 'm', 'l']),
  themeStyle: PropTypes.object.isRequired,
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default withStyles(styles)(AppBar)
