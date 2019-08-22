import * as React from 'react'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import styled from 'styled-components'

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

type MergedComponentProps = Props & InjectedProps

const TableComponent: React.FC<MergedComponentProps> = ({ children, className = '', theme }) => (
  <Wrapper theme={theme} className={className}>
    {children}
  </Wrapper>
)

const Wrapper = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`

export const Table = withTheme(TableComponent)
