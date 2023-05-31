import React, { HTMLAttributes, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { useClassNames } from './useClassNames'
import { useReelCells } from './useReelCells'
import { useReelShadow } from './useReelShadow'

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof PropsWithChildren>

export const TableReel: React.FC<PropsWithChildren & ElementProps> = ({ children, ...props }) => {
  const { showShadow, tableWrapperRef } = useReelCells()
  const classNames = useClassNames()

  return (
    <Shadow showShadow={showShadow} className={`${className}`}>
      <Wrapper {...props} ref={tableWrapperRef} className={classNames.tableReel.wrapper}>
        {children}
      </Wrapper>
    </Shadow>
  )
}

const Shadow = styled.div<{ showShadow: boolean }>`
  ${({ showShadow }) => css`
    position: relative;

    ${useReelShadow({ showShadow })}
  `}
`

const Wrapper = styled.div`
  position: relative;
  overflow: auto;
`
