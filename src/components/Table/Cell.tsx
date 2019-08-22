import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { TableGroupContext } from './Table'

export type Props = {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  colspan?: number
  rowspan?: number
}

const Cell: React.FC<Props & InjectedProps> = ({
  theme,
  className = '',
  children,
  onClick,
  colspan,
  rowspan,
}) => {
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
    <WrapComponent
      onClick={onClick}
      className={className}
      theme={theme}
      colSpan={colspan}
      rowSpan={rowspan}
    >
      {children}
    </WrapComponent>
  )
}

const Th = styled.th`
  ${(props: InjectedProps & Props) => {
    const { theme } = props
    const { size, palette } = theme

    return css`
      font-size: ${size.pxToRem(size.font.SHORT)}
      font-weight: bold;
      padding: ${size.pxToRem(size.space.XS)};
      color: ${palette.TEXT_GREY};

      ${props.onClick &&
        css`
          :hover {
            background-color: ${palette.hoverColor(palette.COLUMN)};
            cursor: pointer;
          }
        `}
    `
  }}
`

const Td = styled.td`
  ${({ theme }: InjectedProps) => {
    const { size, frame } = theme

    return css`
      padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
      border-top: ${frame.border.default};
      font-size: ${size.pxToRem(size.font.TALL)};
    `
  }};
`

export default withTheme(Cell)
