import React, { ReactNode, TableHTMLAttributes, VFC, createContext } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

export const TableGroupContext = createContext<{
  group: 'head' | 'body'
}>({
  group: 'body',
})

type Props = {
  children?: ReactNode
  className?: string
}
type ElementProps = Omit<TableHTMLAttributes<HTMLTableElement>, keyof Props>

export const Table: VFC<Props & ElementProps> = ({ children, className = '', ...props }) => {
  const theme = useTheme()
  const classNames = useClassNames().table

  return (
    <Wrapper {...props} themes={theme} className={`${className} ${classNames.wrapper}`}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.table<{ themes: Theme }>`
  ${({ themes }) => {
    const { COLUMN, HEAD } = themes.color

    return css`
      width: 100%;
      border-collapse: separate; // Headがfixed=trueの場合、separate以外だとHeadとBodyの間に隙間が生まれるため、明示的に指定しています
      border-spacing: 0;
      background-color: ${COLUMN};

      th {
        background-color: ${HEAD};
      }
    `
  }}
`
