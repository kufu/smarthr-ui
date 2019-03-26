import * as React from 'react'
import styled, { css } from 'styled-components'

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

const BoxComponent: React.FC<Props & InjectedProps> = ({
  active,
  children,
  hideModal,
  ...props
}) => (
  <Wrapper className={active ? 'active' : ''}>
    <Background {...props} onClick={hideModal} />
    <Inner {...props}>{children}</Inner>
  </Wrapper>
)

export const Box = withTheme(BoxComponent)

const Wrapper = styled.div`
  visibility: hidden;
  opacity: 0;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease-in-out;
  &.active {
    visibility: visible;
    opacity: 1;
  }
`
const Inner = styled.div`
  ${({ theme, top, right, bottom, left }: MergedStyledProps) => {
    const positionRight: number | string = right ? `${right}px` : 'auto'
    const positionBottom: number | string = bottom ? `${bottom}px` : 'auto'
    let positionTop: number | string = top ? `${top}px` : 'auto'
    let positionLeft: number | string = left ? `${left}px` : 'auto'
    let translateX: string = '0'
    let translateY: string = '0'

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
