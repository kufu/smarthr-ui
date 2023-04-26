import React, { FC, PropsWithChildren, TdHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useTdClassNames } from './useClassNames'

export type Props = PropsWithChildren<{
  /** `true` のとき、セル内が空であれば "----" を表示する */
  nullable?: boolean
  /** `true` のとき、TableReel内で左固定表示になる */
  isFixed?: boolean
}>
type ElementProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, keyof Props>

export const Td: FC<Props & ElementProps> = ({
  nullable = false,
  isFixed = false,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useTdClassNames()
  const wrapperClass = [className, nullable && 'nullable', classNames.wrapper]
    .filter((c) => !!c)
    .join(' ')

  return (
    <StyledTd
      {...props}
      className={`${wrapperClass} ${isFixed && 'fixedElement'}`}
      themes={theme}
      isFixed={isFixed}
    />
  )
}

const StyledTd = styled.td<{ themes: Theme; isFixed: boolean }>`
  &.nullable {
    &:empty {
      &::after {
        content: '-----';
      }
    }
  }

  ${({ themes, isFixed }) => {
    const { fontSize, leading, spacingByChar, color, border } = themes

    return css`
      color: ${color.TEXT_BLACK};
      height: calc(1em * ${leading.NORMAL});
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border-top: ${border.shorthand};
      font-size: ${fontSize.M};
      line-height: ${leading.NORMAL};
      vertical-align: middle;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        z-index: 0;
        left: -12px;
        top: 0;
        width: 12px;
        height: 100%;
        pointer-events: none; /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
        background: linear-gradient(-90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
        opacity: 0;
        transition: opacity 0.2s;
      }

      ${isFixed &&
      css`
        &.fixed {
          position: sticky;
          right: 0;
          background-color: ${color.WHITE};

          &::after {
            opacity: 1;
          }
        }
      `}
    `
  }};
`
