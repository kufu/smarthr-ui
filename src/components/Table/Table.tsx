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

const Table: React.FC<MergedComponentProps> = ({ children, className = '', theme }) => {
  return (
    <Wrapper theme={theme} className={className}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.table`
  ${({ theme }: InjectedProps) => `
    width: 100%;
    border-collapse: separate;
    border: ${theme.frame.border.default};
    border-radius: ${theme.frame.border.radius.m};
    border-spacing: 0;
    overflow: hidden;
  `}
`

export default withTheme(Table)
