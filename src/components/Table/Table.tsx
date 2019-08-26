import * as React from 'react'
import styled from 'styled-components'

export type TableGroup = 'head' | 'body'

export type TableGroupContextValue = {
  group: TableGroup
}

export const TableGroupContext = React.createContext<TableGroupContextValue>({
  group: 'body',
})

export type Props = {
  className?: string
}

export const Table: React.FC<Props> = ({ children, className = '' }) => (
  <Wrapper className={className}>{children}</Wrapper>
)

const Wrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`
