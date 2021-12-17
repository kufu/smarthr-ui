import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

export type BalloonTheme = 'light' | 'dark'

export type Props = {
  /** 吹き出しの垂直位置 */
  horizontal: 'right' | 'center' | 'left'
  /** 吹き出しの水平位置 */
  vertical: 'top' | 'middle' | 'bottom'
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** バルーン内のコンテンツ */
  children?: ReactNode
  /** レンダリングするタグ */
  as?: 'div' | 'span'
}

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const Balloon: VFC<Props & ElementProps> = ({
  horizontal,
  vertical,
  className = '',
  ...props
}) => {
  if (horizontal === 'center' && vertical === 'middle') {
    throw new Error('"vertical" can not be specified as "middle" when "horizontal" is "center".')
  }

  const themes = useTheme()
  const { wrapper } = useClassNames()
  const classNames = `${horizontal} ${vertical} ${className} ${wrapper}`

  return <Base className={classNames} themes={themes} {...props} />
}

const Base = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { color, border, fontSize, shadow } = themes

    return css`
      position: relative;
      display: inline-block;
      font-size: ${fontSize.S};
      border-radius: 4px;
      box-shadow: ${shadow.LAYER2};
      white-space: nowrap;

      &::before,
      &::after {
        display: block;
        position: absolute;
        border-style: ${border.lineStyle};
        content: '';
      }

      background-color: ${color.WHITE};
      color: ${color.TEXT_BLACK};

      &.top {
        &::before,
        &::after {
          border-width: 0 5px 5px;
        }
        &::before {
          top: -5px;
          border-color: transparent transparent ${color.BORDER};
        }
        &::after {
          top: -4px;
          border-color: transparent transparent ${color.WHITE};
        }
      }
      &.bottom {
        &::before,
        &::after {
          border-width: 5px 5px 0;
        }
        &::before {
          bottom: -5px;
          border-color: ${color.BORDER} transparent transparent;
        }
        &::after {
          bottom: -4px;
          border-color: ${color.WHITE} transparent transparent;
        }
      }

      &.right {
        &::before,
        &::after {
          right: 24px;
        }
      }
      &.center {
        &::before,
        &::after {
          left: 50%;
          transform: translateX(-5px);
        }
      }
      &.left {
        &::before,
        &::after {
          left: 24px;
        }
      }

      &.middle {
        &::before,
        &::after {
          top: 50%;
          transform: translateY(-5px);
        }
        &.left {
          &::before,
          &::after {
            border-width: 5px 5px 5px 0;
          }
          &::before {
            left: -5px;
            border-color: transparent ${color.BORDER} transparent transparent;
          }
          &::after {
            left: -4px;
            border-color: transparent ${color.WHITE} transparent transparent;
          }
        }
        &.right {
          &::before,
          &::after {
            border-width: 5px 0 5px 5px;
          }
          &::before {
            right: -5px;
            border-color: transparent transparent transparent ${color.BORDER};
          }
          &::after {
            right: -4px;
            border-color: transparent transparent transparent ${color.WHITE};
          }
        }
      }
    `
  }}
`
