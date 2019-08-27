import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { TableGroupContext } from './Table'

import { isTouchDevice } from '../../libs/ua'

export type Props = {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  colspan?: number
  rowspan?: number
  highlighted?: boolean
}

const CellComponent: React.FC<Props & InjectedProps> = ({
  theme,
  className = '',
  children,
  onClick,
  colspan,
  rowspan,
  highlighted = false,
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

  const classNames = `${className} ${highlighted ? 'highlighted' : ''}`

  return (
    <WrapComponent
      onClick={onClick}
      className={classNames}
      theme={theme}
      colSpan={colspan}
      rowSpan={rowspan}
      highlighted={highlighted}
    >
      {children}
    </WrapComponent>
  )
}

const Th = styled.th`
  ${(props: InjectedProps & Props) => {
    const { theme } = props
    const { size, palette, interaction } = theme

    return css`
      font-size: ${size.pxToRem(size.font.SHORT)}
      font-weight: bold;
      padding: ${size.pxToRem(size.space.XS)};
      color: ${palette.TEXT_GREY};
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`}
      text-align: left;

      &.highlighted {
        background-color: ${palette.hoverColor(palette.COLUMN)};
      }

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
    const { size, palette, frame } = theme

    return css`
      color: ${palette.TEXT_BLACK};
      padding: ${size.pxToRem(size.space.XS)};
      border-top: ${frame.border.default};
      font-size: ${size.pxToRem(size.font.TALL)};
    `
  }};
`

export const Cell = withTheme(CellComponent)
