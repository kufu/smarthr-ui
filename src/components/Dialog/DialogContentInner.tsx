import React, { FC, ReactNode, useRef } from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import { CSSTransition } from 'react-transition-group'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useHandleEscape } from '../../hooks/useHandleEscape'
import { DialogPositionProvider } from './DialogPositionProvider'

type Props = {
  onClickOverlay?: () => void
  onPressEscape?: () => void
  isOpen: boolean
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
  onPressEscape = () => {
    /* noop */
  },
  isOpen,
  children,
  ...props
}) => {
  const theme = useTheme()
  const domRef = useRef(null)
  useHandleEscape(onPressEscape)

  return (
    <DialogPositionProvider top={props.top} bottom={props.bottom}>
      <CSSTransition
        nodeRef={domRef}
        className="wrapper"
        classNames="wrapper"
        in={isOpen}
        timeout={{
          appear: 500,
          enter: 300,
          exit: 300,
        }}
        appear
        unmountOnExit
      >
        <Wrapper ref={domRef}>
          <Background onClick={onClickOverlay} themes={theme} />
          <Inner themes={theme} {...props}>
            {children}
          </Inner>
          {/* Suppresses scrolling of body while modal is displayed */}
          <ScrollSuppressing />
        </Wrapper>
      </CSSTransition>
    </DialogPositionProvider>
  )
}

const Wrapper = styled.div`
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &.wrapper-appear {
    opacity: 0;
  }
  &.wrapper-appear-active {
    transition: opacity 500ms;
    opacity: 1;
  }
  &.wrapper-enter {
    opacity: 0;
  }
  &.wrapper-enter-active {
    transition: opacity 300ms;
    opacity: 1;
  }
  &.wrapper-exit {
    opacity: 1;
  }
  &.wrapper-exit-active {
    transition: opacity 300ms;
    opacity: 0;
  }
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
