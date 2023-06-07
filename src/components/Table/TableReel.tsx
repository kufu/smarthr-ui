import React, { HTMLAttributes, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { useClassNames } from './useClassNames'
import { useReelCells } from './useReelCells'
import { useReelShadow } from './useReelShadow'

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof PropsWithChildren>

export const TableReel: React.FC<PropsWithChildren & ElementProps> = ({
  children,
  className = '',
  ...props
}) => {
  const { showShadow, tableWrapperRef } = useReelCells()
  const classNames = useClassNames()

  return (
    <Wrapper showShadow={showShadow} className={`${className} ${classNames.tableReel.wrapper}`}>
      <Inner {...props} ref={tableWrapperRef} className={classNames.tableReel.inner}>
        {children}
      </Inner>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ showShadow: boolean }>`
  ${({ showShadow }) => css`
    position: relative;

    ${useReelShadow({ showShadow })}
  `}
`

const Inner = styled.div`
  position: relative;
  overflow: auto;
`
