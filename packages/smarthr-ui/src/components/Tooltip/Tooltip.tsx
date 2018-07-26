import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { withTheme, InjectedProps } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'
import Balloon from '../Balloon/'

type TooltipSize = 's' | 'm' | 'l'
interface Props extends React.Props<{}> {
  text: string
  size?: TooltipSize
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
    const { text, size = 'm', theme, children } = this.props

    return (
      <Wrapper onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <BalloonWrapper className={active ? 'active' : ''}>
          <Balloon theme="dark" horizontal="center" vertical="bottom">
            <BalloonInner theme={theme} size={size}>
              {text}
            </BalloonInner>
          </Balloon>
        </BalloonWrapper>
        {children}
      </Wrapper>
    )
  }
}

export default withTheme(Tooltip)

interface Styles extends InjectedProps {
  size: TooltipSize
}
const sizeMap = {
  s: {
    padding: '2px 5px',
    fontSize: 10,
  },
  m: {
    padding: '5px 10px',
    fontSize: 12,
  },
  l: {
    padding: '10px 15px',
    fontSize: 14,
  },
}
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
const BalloonInner = styled.div`
  padding: ${({ size }: Styles) => sizeMap[size].padding};
  font-size: ${({ theme, size }: Styles) => theme.typography.pxToRem(sizeMap[size].fontSize)};
`
