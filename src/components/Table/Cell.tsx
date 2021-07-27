import React, { ReactNode, TdHTMLAttributes, VFC, useContext } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { TableGroupContext } from './Table'

export type Props = {
  colSpan?: number
  rowSpan?: number
  highlighted?: boolean
  nullable?: boolean
  children?: ReactNode
  className?: string
  onClick?: () => void
}
type ElementProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, keyof Props>

export const Cell: VFC<Props & ElementProps> = ({
  className = '',
  children,
  onClick,
  colSpan,
  rowSpan,
  highlighted = false,
  nullable = false,
  ...elementProps
}) => {
  const theme = useTheme()
  const { group } = useContext(TableGroupContext)
  const classNames = useClassNames().cell
  const wrapperClass = [
    className,
    highlighted && 'highlighted',
    nullable && 'nullable',
    classNames.wrapper,
  ]
    .filter((c) => !!c)
    .join(' ')
  const props = {
    children,
    onClick,
    colSpan,
    rowSpan,
    className: wrapperClass,
    themes: theme,
    ...elementProps,
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
    const { fontSize, spacingByChar, color, interaction } = themes

    return css`
      height: 1.5rem;
      font-size: ${fontSize.S};
      font-weight: bold;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      color: ${color.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`};
      text-align: left;
      line-height: 1.5;
      vertical-align: middle;

      &.highlighted {
        background-color: ${color.hoverColor(color.HEAD)};
      }

      ${onClick &&
      css`
        :hover {
          background-color: ${color.hoverColor(color.HEAD)};
          cursor: pointer;
        }
      `}
    `
  }}
`
const Td = styled.td<{ themes: Theme }>`
  &.nullable {
    &:empty {
      &::after {
        content: '-----';
      }
    }
  }

  ${({ themes }) => {
    const { fontSize, spacingByChar, color, border } = themes

    return css`
      color: ${color.TEXT_BLACK};
      height: 1.75rem;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border-top: ${border.shorthand};
      font-size: ${fontSize.M};
      line-height: 1.5;
      vertical-align: middle;
    `
  }};
`
