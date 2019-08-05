import * as React from 'react'
import styled, { keyframes, css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

interface Props {
  color?: string
  size?: 's' | 'm' | 'l'
}

const LoaderComponent: React.FC<Props & InjectedProps> = ({ color, size }) => {
  const loaderColor = color || '#fff'
  const loaderSize = size || 'm'

  return (
    <Wrapper className={loaderSize} color={loaderColor}>
      <div />
      <div />
      <div />
      <div />
      <div />
    </Wrapper>
  )
}

export const Loader = withTheme(LoaderComponent)

const lineScale = keyframes`
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(.4);
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
