import * as React from 'react'
import styled from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

export type TableGroup = 'head' | 'body'

export type TableGroupContextValue = {
  group: TableGroup
}

export const TableGroupContext = React.createContext<TableGroupContextValue>({
  group: 'body',
})

export type Props = {
  children?: React.ReactNode
  className?: string
}

const TableComponent: React.FC<Props & InjectedProps> = ({ theme, children, className = '' }) => (
  <Wrapper theme={theme} className={className}>
    {children}
  </Wrapper>
)

export const Table = withTheme(TableComponent)

const Wrapper = styled.table`
  ${({ theme }: InjectedProps) => `
    background-color: ${theme.palette.COLUMN};
  `}
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  & > thead > tr > th {
    background-color: ${({ theme }: InjectedProps) => theme.palette.COLUMN};
  }
`
