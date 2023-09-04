import React, { FC, HTMLAttributes, createContext, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { DropdownCloser } from './DropdownCloser'
import { ContentBoxStyle, Rect, getContentBoxStyle } from './dropdownHelper'
import { useKeyboardNavigation } from './useKeyboardNavigation'

type Props = {
  triggerRect: Rect
  scrollable: boolean
  children: React.ReactNode
  className: string
  controllable: boolean
}

export type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

type DropdownContentInnerContextType = {
  maxHeight: string
}

export const DropdownContentInnerContext = createContext<DropdownContentInnerContextType>({
  maxHeight: '',
})

export const DropdownContentInner: FC<Props & ElementProps> = ({
  triggerRect,
  scrollable,
  children,
  className,
  controllable,
  ...props
}) => {
  const theme = useTheme()
  const [isActive, setIsActive] = useState(false)
  const [contentBox, setContentBox] = useState<ContentBoxStyle>({
    top: 'auto',
    maxHeight: '',
  })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const focusTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (wrapperRef.current) {
      setContentBox(
        getContentBoxStyle(
          triggerRect,
          {
            width: wrapperRef.current.offsetWidth,
            height: wrapperRef.current.offsetHeight,
          },
          {
            width: document.body.clientWidth,
            height: innerHeight,
          },
          {
            top: scrollY,
            left: scrollX,
          },
        ),
      )
      setIsActive(true)
    }
  }, [triggerRect])

  useEffect(() => {
    if (isActive) {
      focusTargetRef.current?.focus()
    }
  }, [isActive])

  useKeyboardNavigation(wrapperRef, focusTargetRef)

  return (
    <Wrapper
      {...props}
      ref={wrapperRef}
      contentBox={contentBox}
      className={`${className} ${isActive ? 'active' : ''}`}
      themes={theme}
    >
      {/* dummy element for focus management. */}
      <div tabIndex={-1} ref={focusTargetRef} />
      {controllable ? (
        <ControllableWrapper scrollable={scrollable} contentBox={contentBox}>
          {children}
        </ControllableWrapper>
      ) : (
        <DropdownContentInnerContext.Provider value={{ maxHeight: contentBox.maxHeight }}>
          <DropdownCloser>{children}</DropdownCloser>
        </DropdownContentInnerContext.Provider>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  themes: Theme
  contentBox: ContentBoxStyle
}>`
  ${({ contentBox, themes }) => {
    const { color, radius, zIndex, shadow, spacingByChar } = themes
    const leftMargin =
      contentBox.left === undefined ? spacingByChar(0.5) : `max(${contentBox.left}, 0px)`
    const rightMargin =
      contentBox.right === undefined ? spacingByChar(0.5) : `max(${contentBox.right}, 0px)`

    return css`
      display: flex;
      visibility: hidden;
      z-index: ${zIndex.OVERLAP_BASE};
      position: absolute;
      top: ${contentBox.top};
      ${contentBox.left !== undefined &&
      css`
        left: ${contentBox.left};
      `}
      ${contentBox.right !== undefined &&
      css`
        right: ${contentBox.right};
      `}
      max-width: calc(100% - ${leftMargin} - ${rightMargin});
      word-break: break-word;
      border-radius: ${radius.m};
      box-shadow: ${shadow.LAYER3};
      background-color: ${color.WHITE};

      &.active {
        visibility: visible;
      }
    `
  }}
`
const ControllableWrapper = styled.div<{
  contentBox: ContentBoxStyle
  scrollable: boolean
}>`
  ${({ contentBox, scrollable }) => css`
      display: flex;
      flex-direction: column;
      ${contentBox.maxHeight && scrollable
        ? `
          max-height: ${contentBox.maxHeight};
          `
        : ''}
    `}
`
