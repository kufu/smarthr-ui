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
  fixedHead?: boolean
  children?: ReactNode
  className?: string
}
type ElementProps = Omit<TableHTMLAttributes<HTMLTableElement>, keyof Props>

export const Table: VFC<Props & ElementProps> = ({
  fixedHead = false,
  children,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames().table

  return (
    <Wrapper
      {...props}
      fixedHead={fixedHead}
      themes={theme}
      className={`${className} ${classNames.wrapper}`}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.table<{ fixedHead: boolean; themes: Theme }>`
  ${({ fixedHead, themes }) => {
    const { color, zIndex } = themes

    return css`
      width: 100%;
      border-collapse: separate; /* Headがfixed=trueの場合、separate以外だとHeadとBodyの間に隙間が生まれるため、明示的に指定しています */
      border-spacing: 0;
      background-color: ${color.COLUMN};

      thead {
        ${fixedHead &&
        css`
          position: sticky;
          top: 0;
          left: 0;
          z-index: ${zIndex.FIXED_MENU}; /* zIndexの値はセマンティクストークンとして管理しているため、明示的に値を指定しないと重なり順が崩れるため設定しています */
        `}
      }

      tbody {
        background-color: ${color.WHITE};
      }

      th {
        background-color: ${color.HEAD};
      }
    `
  }}
`
