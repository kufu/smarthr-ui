import React, { FC, ReactNode, useCallback, useRef } from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import { CSSTransition } from 'react-transition-group'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useHandleEscape } from '../../hooks/useHandleEscape'
import { DialogPositionProvider } from './DialogPositionProvider'
import { FocusTrap } from './FocusTrap'

export type DialogContentInnerProps = {
  onClickOverlay?: () => void
  onPressEscape?: () => void
  isOpen: boolean
  top?: number
  right?: number
  bottom?: number
  left?: number
  id?: string
  ariaLabel?: string
  ariaLabelledby?: string
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

export const DialogContentInner: FC<DialogContentInnerProps> = ({
  onClickOverlay,
  onPressEscape = () => {
    /* noop */
  },
  isOpen,
  id,
  ariaLabel,
  ariaLabelledby,
  children,
  ...props
}) => {
  const theme = useTheme()
  const domRef = useRef(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const focusTarget = useRef<HTMLDivElement>(null)
  useHandleEscape(
    useCallback(() => {
      if (!isOpen) {
        return
      }
      onPressEscape()
    }, [isOpen, onPressEscape]),
  )

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
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        <Wrapper ref={domRef} themes={theme}>
          <Background onClick={onClickOverlay} themes={theme} />
          <FocusTrap>
            <Inner ref={innerRef} themes={theme} role="dialog" aria-modal="true" {...props}>
              {/* dummy element for focus management. */}
              <div ref={focusTarget} tabIndex={-1} aria-label={ariaLabel}></div>
              {children}
            </Inner>
          </FocusTrap>
          {/* Suppresses scrolling of body while modal is displayed */}
          <ScrollSuppressing />
        </Wrapper>
      </CSSTransition>
    </DialogPositionProvider>
  )
}

const Wrapper = styled.div<{ themes: Theme }>(({ themes }) => {
  const { zIndex } = themes

  return css`
    z-index: ${zIndex.OVERLAP};
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
})

const Inner = styled.div<StyleProps & { themes: Theme }>`
  ${({ themes, top, right, bottom, left }) => {
    const { zIndex, frame } = themes
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
      z-index: ${zIndex.OVERLAP};
      top: ${positionTop};
      right: ${positionRight};
      bottom: ${positionBottom};
      left: ${positionLeft};
      border-radius: ${frame.border.radius.m};
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
