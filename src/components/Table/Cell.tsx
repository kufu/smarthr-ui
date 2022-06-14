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

/**
 * @deprecated Cell コンポーネントは非推奨です。代わりに Th または Td コンポーネントを使用してください。
 */
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
    const { fontSize, leading, spacingByChar, color, interaction } = themes

    return css`
      height: calc(1em * ${leading.NORMAL} + ${spacingByChar(0.5)} * 2);
      font-size: ${fontSize.S};
      font-weight: bold;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      color: ${color.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`};
      text-align: left;
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;

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
    const { fontSize, leading, spacingByChar, color, border } = themes

    return css`
      color: ${color.TEXT_BLACK};
      height: calc(1em * ${leading.RELAXED} + ${spacingByChar(0.5)} * 2);
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border-top: ${border.shorthand};
      font-size: ${fontSize.M};
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;
    `
  }};
`
