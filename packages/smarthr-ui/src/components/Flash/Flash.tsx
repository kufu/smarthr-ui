import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

interface Props extends React.Props<{}> {}
interface State {
  bounce: boolean
  fadeout: boolean
  remove: boolean
}

const FADEOUT_DELAY = 8000
const REMOVE_DELAY = 10000

export default class Flash extends React.Component<Props, State> {
  public static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  }
  public fadeoutTimer: any = null
  public removeTimer: any = null

  constructor(props: Props) {
    super(props)

    this.state = {
      bounce: false,
      fadeout: false,
      remove: false,
    }
  }

  public fadeout = () => {
    this.setState({ fadeout: true })
  }

  public remove = () => {
    this.setState({ remove: true })
  }

  public componentDidMount() {
    this.setState({ bounce: true })
    this.fadeoutTimer = setTimeout(this.fadeout, FADEOUT_DELAY)
    this.removeTimer = setTimeout(this.remove, REMOVE_DELAY)
  }

  public componentWillUnmount() {
    clearTimeout(this.fadeoutTimer)
    clearTimeout(this.removeTimer)
  }

  public render() {
    const { bounce, fadeout, remove } = this.state
    const { children } = this.props

    if (remove) return null

    return (
      <Wrapper className={fadeout ? 'fadeout' : ''} onClick={this.remove}>
        <Box className={bounce ? 'bounce' : ''}>{children}</Box>
      </Wrapper>
    )
  }
}

const bounceAnimation = keyframes`
  from,
  20%,
  53%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`
const Wrapper = styled.div`
  z-index: 9999;
  opacity: 1;
  position: fixed;
  bottom: 50px;
  left: 30px;
  transition: opacity 2s;
  cursor: pointer;

  &.fadeout {
    opacity: 0;
  }
`
const Box = styled.div`
  display: inline-block;
  transform-origin: center bottom;

  &.bounce {
    animation: ${bounceAnimation} 1s 0s both;
  }
`
