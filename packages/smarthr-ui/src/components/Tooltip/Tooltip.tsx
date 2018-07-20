import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import Balloon from '../Balloon/'

import { CreatedTheme } from '../../styles/createTheme'
import { withStyles, InjectedProps } from '../../styles/withStyles'

const styles = (theme: CreatedTheme) => ({
  size: {
    s: {
      padding: '2px 5px',
      fontSize: theme.typography.pxToRem(10),
    },
    m: {
      padding: '5px 10px',
      fontSize: theme.typography.pxToRem(12),
    },
    l: {
      padding: '10px 15px',
      fontSize: theme.typography.pxToRem(14),
    },
  },
})

interface Props extends React.Props<{}> {
  text: string
  size?: 's' | 'm' | 'l'
}
interface State {
  active: boolean
}

class Tooltip extends React.Component<Props & InjectedProps, State> {
  public static propTypes = {
    text: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['s', 'm', 'l']),
    themeStyle: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  }
  public state = {
    active: false,
  }

  public onMouseEnter = () => {
    if (isTouchDevice) return
    this.setState({ active: true })
  }

  public onMouseLeave = () => {
    if (isTouchDevice) return
    this.setState({ active: false })
  }

  public render() {
    const { active } = this.state
    const { text, size, themeStyle, children } = this.props

    return (
      <Wrapper onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <BalloonWrapper className={active ? 'active' : ''}>
          <Balloon theme="dark" horizontal="center" vertical="bottom">
            <div style={themeStyle.size[size || 'm']}>{text}</div>
          </Balloon>
        </BalloonWrapper>
        {children}
      </Wrapper>
    )
  }
}

export default withStyles(styles)(Tooltip)

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`
const BalloonWrapper = styled.div`
  visibility: hidden;
  opacity: 0;
  bottom: 100%;

  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.2s ease-in-out;

  &.active {
    visibility: visible;
    opacity: 1;
    bottom: calc(100% + 8px);
  }
`
