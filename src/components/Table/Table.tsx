import React, { FC, ReactNode, createContext } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

export const TableGroupContext = createContext<{
  group: 'head' | 'body'
}>({
  group: 'body',
})

type Props = {
  children?: ReactNode
  className?: string
}

export const Table: FC<Props> = ({ children, className = '' }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme} className={className}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.table<{ themes: Theme }>`
  ${({ themes }) => {
    const { COLUMN } = themes.palette

    return css`
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      background-color: ${COLUMN};

      th {
        background-color: ${COLUMN};
      }
    `
  }}
`
