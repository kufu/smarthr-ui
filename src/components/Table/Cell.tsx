import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { TableGroupContext } from './Table'

export type Props = {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

const Cell: React.FC<Props & InjectedProps> = ({ theme, className = '', children, onClick }) => {
  const { group } = React.useContext(TableGroupContext)

  const WrapComponent = (tableGroup => {
    switch (tableGroup) {
      case 'body':
        return Td
      case 'head':
        return Th
    }
  })(group)

  return (
    <WrapComponent onClick={onClick} className={className} theme={theme}>
      {children}
    </WrapComponent>
  )
}

const cellStyle = css`
  border-style: none;
  text-align: left;
  padding: ${({ theme }: InjectedProps) => `${theme.size.space.XXS}px`};
  ${(props: InjectedProps & Props) =>
    props.onClick &&
    css`
      :hover {
        background-color: ${props.theme.palette.hoverColor(props.theme.palette.BACKGROUND)};
        cursor: pointer;
      }
    `}
`

const Th = styled.th`
  ${cellStyle}
  font-size: 11px;
`

const Td = styled.td`
  ${cellStyle}
  font-size: 14px;
`

export default withTheme(Cell)
