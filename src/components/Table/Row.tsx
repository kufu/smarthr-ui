import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

export type Props = {
  children?: React.ReactNode
}

const Row: React.FC<Props & InjectedProps> = props => {
  return <Wrapper theme={props.theme}>{props.children}</Wrapper>
}
const Wrapper = styled.tr`
  ${({ theme }: InjectedProps) => css`
    :hover td {
      background-color: ${theme.palette.Mono_P03};
    }
  `}
`

export default withTheme(Row)
