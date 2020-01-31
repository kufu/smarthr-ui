import React, { FC, ReactNode } from 'react'
import styled, { createGlobalStyle, css, keyframes } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useHandleEscape } from '../../hooks/useHandleEscape'
import { DialogPositionProvider } from './DialogPositionProvider'

type Props = {
  onClickOverlay?: () => void
  onPressEscape?: () => void
  top?: number
  right?: number
  bottom?: number
  left?: number
  children: ReactNode
}

type StyleProps = {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

function exist(value: any) {
  return value !== undefined && value !== null
}

export const DialogContentInner: FC<Props> = ({
  onClickOverlay,
  onPressEscape = () => undefined,
  children,
  ...props
}) => {
  const theme = useTheme()
  useHandleEscape(onPressEscape)
  return (
    <DialogPositionProvider top={props.top} bottom={props.bottom}>
      <Wrapper>
        <Background onClick={onClickOverlay} themes={theme} {...props} />
        <Inner themes={theme} {...props}>
          {children}
        </Inner>
        {/* Suppresses scrolling of body while modal is displayed */}
        <ScrollSuppressing />
      </Wrapper>
    </DialogPositionProvider>
  )
}

const fadeIn = keyframes`
  0% { opacity: 0 }
  30% { opacity: 0.1 }
  70% { opacity: 0.9 }
  100% { opacity: 1 }
`
const Wrapper = styled.div`
  opacity: 0;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: 0.3s 0s both ${fadeIn};
`
const Inner = styled.div<StyleProps & { themes: Theme }>`
  ${({ themes, top, right, bottom, left }) => {
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
      border-radius: ${themes.frame.border.radius.l};
      background-color: #fff;
      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);
      transform: translate(${translateX}, ${translateY});
    `
  }}
`
const Background = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    return css`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${themes.palette.SCRIM};
    `
  }}
`
const ScrollSuppressing = createGlobalStyle`
  body {
    overflow: hidden;
  }
`
