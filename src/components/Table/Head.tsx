import * as React from 'react'
import styled from 'styled-components'
import { TableGroupContext } from './Table'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

export type Props = {
  children?: React.ReactNode
  className?: string
}
const HeadComponent: React.FC<Props & InjectedProps> = ({ theme, className = '', children }) => {
  return (
    <Wrapper theme={theme} className={className}>
      <TableGroupContext.Provider value={{ group: 'head' }}>{children}</TableGroupContext.Provider>
    </Wrapper>
  )
}

const Wrapper = styled.thead`
  ${({ theme }: InjectedProps) => `
    background-color: ${theme.palette.COLUMN};
  `}
`

export const Head = withTheme(HeadComponent)
