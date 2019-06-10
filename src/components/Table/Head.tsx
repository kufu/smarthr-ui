import * as React from 'react'
import styled from 'styled-components'
import { TableGroupContext } from './Table'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

export type Props = {
  children?: React.ReactNode
}
const Head: React.FC<Props & InjectedProps> = props => {
  return (
    <Wrapper theme={props.theme}>
      <TableGroupContext.Provider value={{ group: 'head' }}>
        {props.children}
      </TableGroupContext.Provider>
    </Wrapper>
  )
}

const Wrapper = styled.thead`
  ${({ theme }: InjectedProps) => `
    background-color: ${theme.palette.Mono_P10};
`}
`

export default withTheme(Head)
