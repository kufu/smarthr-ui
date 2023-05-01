import React, { HTMLAttributes, PropsWithChildren, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { useReelCells } from './useReelCells'

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof PropsWithChildren>

export const TableReel: React.FC<PropsWithChildren & ElementProps> = ({ children, ...props }) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)

  useReelCells(tableWrapperRef, setShowShadow)

  return (
    <Shadow showShadow={showShadow}>
      <Wrapper {...props} ref={tableWrapperRef}>
        {children}
      </Wrapper>
    </Shadow>
  )
}

type ReelShadow = {
  showShadow?: boolean
  direction?: 'left' | 'right'
}

export const reelShadow = ({ showShadow = true, direction = 'left' }: ReelShadow) => {
  const shadowWidth = '12px' //影の横幅はpx指定で固定とする

  return `
    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      left: ${direction === 'left' ? '0' : `-${shadowWidth}`};
      top: 0;
      width: ${shadowWidth};
      pointer-events: none; /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
      inset-block: 0;
      background: linear-gradient(${
        direction === 'left' ? '90deg' : '-90deg'
      }, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
      opacity: ${showShadow ? 1 : 0};
      transition: opacity 0.2s;
    }
  `
}

const Shadow = styled.div<{ showShadow: boolean }>`
  ${({ showShadow }) => css`
    position: relative;

    ${reelShadow({ showShadow })}
  `}
`

const Wrapper = styled.div`
  position: relative;
  overflow: auto;
`
