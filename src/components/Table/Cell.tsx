import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { TableContext, tableSizes, TableGroupContext } from './Table'
const tableSizeToPaddingMap = {
  [tableSizes.s]: 8,
  [tableSizes.m]: 12,
  [tableSizes.l]: 16,
}
export type Props = {
  children?: React.ReactNode
}
const Cell: React.FC<Props & InjectedProps> = props => {
  const { group } = React.useContext(TableGroupContext)
  const { size, disabled } = React.useContext(TableContext)

  const WrapComponent = (tableGroup => {
    switch (tableGroup) {
      case 'body':
        return Td
      case 'head':
        return Th
    }
  })(group)
  return (
    <WrapComponent theme={props.theme} disabled={disabled} margin={tableSizeToPaddingMap[size]}>
      {props.children}
    </WrapComponent>
  )
}

type WrapperProps = InjectedProps & {
  margin: number
  disabled: boolean
}

const cellStyle = css`
  ${(props: WrapperProps) => `
    padding-top: ${props.theme.size.pxToRem(props.margin)};
    padding-bottom: ${props.theme.size.pxToRem(props.margin)};
    padding-left: 0;
    padding-right: 0;
    border-style: none;
  `}
`

const Td = styled.td`
  ${cellStyle}
  ${(props: WrapperProps) => props.disabled && `opacity: 0.5;`}
`

const Th = styled.th`
  ${cellStyle}
`

export default withTheme(Cell)
