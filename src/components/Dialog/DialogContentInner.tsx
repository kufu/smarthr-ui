import React, { useEffect, useState } from 'react'
import styled, { css, createGlobalStyle } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

type Props = {
  onClickOverlay?: () => void
  top?: number
  right?: number
  bottom?: number
  left?: number
  children: React.ReactNode
}

type MergedStyledProps = InjectedProps & {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

function exist(value: any) {
  return value !== undefined && value !== null
}

const DialogContentInnerComponent: React.FC<Props & InjectedProps> = ({
  onClickOverlay,
  children,
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Wrapper className={isMounted ? 'active' : ''}>
      <Background onClick={onClickOverlay} {...props} />
      <Inner {...props}>{children}</Inner>
      {/* Suppresses scrolling of body while modal is displayed */}
      <ScrollSuppressing />
    </Wrapper>
  )
}

export const DialogContentInner = withTheme(DialogContentInnerComponent)

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
      background-color: #fff;
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
      background-color: ${theme.palette.SCRIM};
    `
  }}
`
const ScrollSuppressing = createGlobalStyle`
  body {
    overflow: hidden;
  }
`
