import React, { ReactNode, FC, useContext } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { useTheme, Theme } from '../../hooks/useTheme'

import { TableGroupContext } from './Table'

export type Props = {
  colspan?: number
  rowspan?: number
  highlighted?: boolean
  children?: ReactNode
  className?: string
  onClick?: () => void
}

export const Cell: FC<Props> = ({
  className = '',
  children,
  onClick,
  colspan,
  rowspan,
  highlighted = false,
}) => {
  const { group } = useContext(TableGroupContext)
  const theme = useTheme()

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
      colSpan={colspan}
      rowSpan={rowspan}
      className={classNames}
      onClick={onClick}
      themes={theme}
    >
      {children}
    </WrapComponent>
  )
}

const Th = styled.th<{ themes: Theme; onClick?: () => void }>`
  ${({ themes, onClick }) => {
    const { size, palette, interaction } = themes

    return css`
      font-size: ${size.pxToRem(size.font.SHORT)}
      font-weight: bold;
      padding: ${size.pxToRem(size.space.XS)};
      color: ${palette.TEXT_GREY};
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`}
      text-align: left;
      line-height: 1.5;
      vertical-align: middle;

      &.highlighted {
        background-color: ${palette.hoverColor(palette.COLUMN)};
      }

      ${onClick &&
        css`
          :hover {
            background-color: ${palette.hoverColor(palette.COLUMN)};
            cursor: pointer;
          }
        `}
    `
  }}
`
const Td = styled.td<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette, frame } = themes

    return css`
      color: ${palette.TEXT_BLACK};
      padding: ${size.pxToRem(size.space.XS)};
      border-top: ${frame.border.default};
      font-size: ${size.pxToRem(size.font.TALL)};
      line-height: 1.5;
      vertical-align: middle;
    `
  }};
`
