import React, { HTMLAttributes, PropsWithChildren, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { reelShadow } from './reelShadow'
import { useReelCells } from './useReelCells'

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof PropsWithChildren>

export const TableReel: React.FC<PropsWithChildren & ElementProps> = ({ children, ...props }) => {
  const { showShadow, tableWrapperRef } = useReelCells()

  return (
    <Shadow showShadow={showShadow}>
      <Wrapper {...props} ref={tableWrapperRef}>
        {children}
      </Wrapper>
    </Shadow>
  )
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
