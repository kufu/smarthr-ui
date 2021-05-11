import React, { FC, HTMLAttributes, ReactNode, useContext } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

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
type ElementProps = Omit<HTMLAttributes<HTMLTableDataCellElement>, keyof Props>

export const Cell: FC<Props & ElementProps> = ({
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
  const classNames = [className, highlighted && 'highlighted', nullable && 'nullable']
    .filter((c) => !!c)
    .join(' ')
  const props = {
    children,
    onClick,
    colSpan,
    rowSpan,
    className: classNames,
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
    const { size, spacingByChar, palette, interaction } = themes

    return css`
      height: ${size.pxToRem(40)};
      font-size: ${size.pxToRem(size.font.SHORT)};
      font-weight: bold;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      color: ${palette.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`};
      text-align: left;
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;

      &.highlighted {
        background-color: ${palette.hoverColor(palette.HEAD)};
      }

      ${onClick &&
      css`
        :hover {
          background-color: ${palette.hoverColor(palette.HEAD)};
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
    const { size, spacingByChar, palette, frame } = themes

    return css`
      color: ${palette.TEXT_BLACK};
      height: ${size.pxToRem(44)};
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border-top: ${frame.border.default};
      font-size: ${size.pxToRem(size.font.TALL)};
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;
    `
  }};
`
