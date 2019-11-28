import React, { ReactNode, FC, useContext } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { useTheme, Theme } from '../../hooks/useTheme'

import { TableGroupContext } from './Table'

// TODO: colspan and rowspan are incorrect naming conventions and are now deprecated and removed later.
// Delete in January 2020.
export type Props = {
  colSpan?: number
  rowSpan?: number
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
  colSpan,
  rowSpan,
  colspan,
  rowspan,
  highlighted = false,
}) => {
  const theme = useTheme()
  const { group } = useContext(TableGroupContext)
  const classNames = `${className} ${highlighted ? 'highlighted' : ''}`
  const props = {
    children,
    onClick,
    colSpan: colSpan || colspan,
    rowSpan: rowSpan || rowspan,
    className: classNames,
    themes: theme,
  }

  if (group === 'head') {
    return <Th {...props} />
  } else if (group === 'body') {
    return <Td {...props} />
  } else {
    return null
  }
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
