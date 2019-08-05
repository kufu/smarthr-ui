import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { DropdownConsumer } from './Dropdown'

export interface Rect {
  top: number
  right: number
  bottom: number
  left: number
}

interface Props {
  offset?: {
    x?: number
    y?: number
  }
  children?: React.ReactNode
}

const getHorizontalPositionClassName = (clientRect?: Rect): 'center' | 'left' | 'right' => {
  if (!clientRect) return 'center'
  if (clientRect.right < window.innerWidth / 2) return 'left'
  if (clientRect.left > window.innerWidth / 2) return 'right'
  return 'center'
}

const getVerticalPositionClassName = (clientRect?: Rect): 'middle' | 'top' | 'bottom' => {
  if (!clientRect) return 'middle'
  if (clientRect.top > window.innerHeight / 2) return 'bottom'
  if (clientRect.bottom < window.innerHeight / 2) return 'top'
  return 'middle'
}

const DropdownContentComponent: React.FC<Props & InjectedProps> = ({ offset, children, theme }) => (
  <DropdownConsumer>
    {({ active, clientRect }) => (
      <Wrapper
        className={`${active ? 'active' : ''} ${getHorizontalPositionClassName(
          clientRect,
        )} ${getVerticalPositionClassName(clientRect)}`}
        offset={offset}
      >
        <Balloon theme={theme}>{children}</Balloon>
      </Wrapper>
    )}
  </DropdownConsumer>
)

export const DropdownContent = withTheme(DropdownContentComponent)

const Wrapper = styled.div`
  ${({ offset = {} }: Props & InjectedProps) => {
    return css`
      visibility: hidden;
      opacity: 0;
      transform: scale(0);
      z-index: 1000;
      position: absolute;
      width: auto;
      height: auto;
      transition: visibility 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
        opacity 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
        transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

      &.top {
        top: calc(100% + ${offset.y || 0}px);
      }

      &.bottom {
        bottom: calc(100% + ${offset.y || 0}px);
      }

      &.right {
        right: ${offset.x || 0}px;
      }

      &.left {
        left: ${offset.x || 0}px;
      }

      &.active {
        visibility: visible;
        opacity: 1;
        transform: scale(1);
      }
    `
  }}
`
const Balloon = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      position: relative;
      display: inline-block;
      border-radius: ${theme.frame.border.radius.m};
      box-shadow: 0 2px 8px 0 rgba(51, 51, 51, 0.35);
      background-color: #fff;
      white-space: nowrap;
    `
  }}
`
