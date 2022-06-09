import React, { ReactNode, TdHTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useTdClassNames } from './useClassNames'

export type Props = {
  /** `true` のとき、セル内が空であれば "----" を表示する */
  nullable?: boolean
  /** セルの内容 */
  children?: ReactNode
}
type ElementProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, keyof Props>

export const Td: VFC<Props & ElementProps> = ({ nullable = false, className = '', ...props }) => {
  const theme = useTheme()
  const classNames = useTdClassNames()
  const wrapperClass = [className, nullable && 'nullable', classNames.wrapper]
    .filter((c) => !!c)
    .join(' ')

  return <StyledTd {...props} className={wrapperClass} themes={theme} />
}

const StyledTd = styled.td<{ themes: Theme }>`
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
      height: calc(${leading.RELAXED}rem + ${spacingByChar(0.5)} * 2);
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border-top: ${border.shorthand};
      font-size: ${fontSize.M};
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;
    `
  }};
`
