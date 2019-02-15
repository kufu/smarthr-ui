import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { DropdownConsumer } from './Dropdown'

export interface Rect {
  right: number
  left: number
}

interface Props {
  children?: React.ReactNode
}

const getPositionClassName = (clientRect?: Rect): 'center' | 'left' | 'right' => {
  if (!clientRect) return 'center'
  if (clientRect.right < window.innerWidth / 2) return 'left'
  if (clientRect.left > window.innerWidth / 2) return 'right'
  return 'center'
}

const DropdownContentComponent: React.FC<Props & InjectedProps> = ({ children, theme }) => (
  <DropdownConsumer>
    {({ active, clientRect }) => (
      <Wrapper className={`${active ? 'active' : ''} ${getPositionClassName(clientRect)}`}>
        <Balloon theme={theme}>{children}</Balloon>
      </Wrapper>
    )}
  </DropdownConsumer>
)

export const DropdownContent = withTheme(DropdownContentComponent)

const Wrapper = styled.div`
  visibility: hidden;
  opacity: 0;
  transform: scale(0);
  z-index: 1000;
  position: absolute;
  top: calc(100% + 10px);
  width: auto;
  height: auto;
  transition: visibility 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
    opacity 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
    transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &.right {
    right: 0;
  }

  &.left {
    left: 0;
  }

  &.active {
    visibility: visible;
    opacity: 1;
    transform: scale(1);
  }
`
const Balloon = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      position: relative;
      display: inline-block;
      border-radius: ${theme.frame.border.radius.s};
      box-shadow: 0 2px 8px 0 rgba(51, 51, 51, 0.35);
      background-color: ${theme.palette.White};
      white-space: nowrap;
    `
  }}
`
