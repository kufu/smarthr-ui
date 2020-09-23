import React, { FC } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { VISUALLY_HIDDEN_STYLE } from '../../constants'

type Props = {
  color?: string
  size?: 's' | 'm' | 'l'
  className?: string
}

export const Loader: FC<Props> = ({ color = '#fff', size = 'm', className = '' }) => (
  <Wrapper className={`${size} ${className}`} color={color} role="status">
    <VisuallyHidden>Loading</VisuallyHidden>
    <div />
    <div />
    <div />
    <div />
    <div />
  </Wrapper>
)

const lineScale = keyframes`
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.4);
  }
`
const Wrapper = styled.div`
  ${({ color }: { color: string }) => css`
    display: inline-block;

    &.s {
      transform: scale(0.8);
    }
    &.l {
      transform: scale(1.2);
    }

    & > div {
      display: inline-block;
      width: 4px;
      height: 35px;
      border-radius: 2px;
      margin: 2px;
      background-color: ${color};

      &:nth-child(1) {
        animation: ${lineScale} 1s -0.4s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
      }
      &:nth-child(2) {
        animation: ${lineScale} 1s -0.3s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
      }
      &:nth-child(3) {
        animation: ${lineScale} 1s -0.2s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
      }
      &:nth-child(4) {
        animation: ${lineScale} 1s -0.1s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
      }
      &:nth-child(5) {
        animation: ${lineScale} 1s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
      }
    }
  `}
`

const VisuallyHidden = styled.span`
  ${VISUALLY_HIDDEN_STYLE}
`
