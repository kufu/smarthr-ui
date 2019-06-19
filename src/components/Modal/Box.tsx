import * as React from 'react'
import styled, { css, createGlobalStyle } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

interface Props {
  active: boolean
  top?: number
  right?: number
  bottom?: number
  left?: number
  hideModal?: () => void
  children?: React.ReactNode
}

interface MergedStyledProps extends InjectedProps {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

interface State {
  scrollTop: number
}

export class BoxComponent extends React.Component<Props & InjectedProps, State> {
  public state = { scrollTop: 0 }

  public static getDerivedStateFromProps(props: Props) {
    if (props.active) {
      return {
        scrollTop: window.pageYOffset,
      }
    }

    return null
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.active === true && this.props.active === false) {
      window.scrollTo(0, this.state.scrollTop)
    }
  }

  public render() {
    const { active, children, hideModal, ...props } = this.props
    return (
      <Wrapper className={active ? 'active' : ''} {...props}>
        {active ? (
          <React.Fragment>
            <Background {...props} onClick={hideModal} />
            <Inner {...props}>{children}</Inner>
            {/* Suppresses scrolling of body while modal is displayed */}
            <ScrollSuppressing top={this.state.scrollTop} />
          </React.Fragment>
        ) : null}
      </Wrapper>
    )
  }
}

export const Box = withTheme(BoxComponent)

function exist(value: any) {
  return value !== undefined && value !== null
}

const Wrapper = styled.div`
  visibility: hidden;
  opacity: 0;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease-in-out;
  &.active {
    visibility: visible;
    opacity: 1;
  }
`
const Inner = styled.div`
  ${({ theme, top, right, bottom, left }: MergedStyledProps) => {
    const positionRight = exist(right) ? `${right}px` : 'auto'
    const positionBottom = exist(bottom) ? `${bottom}px` : 'auto'
    let positionTop = exist(top) ? `${top}px` : 'auto'
    let positionLeft = exist(left) ? `${left}px` : 'auto'
    let translateX = '0'
    let translateY = '0'

    if (top === undefined && bottom === undefined) {
      positionTop = '50%'
      translateY = '-50%'
    }

    if (right === undefined && left === undefined) {
      positionLeft = '50%'
      translateX = '-50%'
    }

    return css`
      position: absolute;
      z-index: 10100;
      top: ${positionTop};
      right: ${positionRight};
      bottom: ${positionBottom};
      left: ${positionLeft};
      border-radius: ${theme.frame.border.radius.l};
      background-color: ${theme.palette.White};
      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);
      transform: translate(${translateX}, ${translateY});
    `
  }}
`
const Background = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${theme.palette.Overlay};
    `
  }}
`
const ScrollSuppressing = createGlobalStyle`
  body {
    overflow: hidden;
    position: fixed;
    top: -${({ top }: { top: number }) => top}px;
    width: 100%;
    height: 100%;
  }
`
