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

  return <Base {...props} className={classNames} themes={themes} />
}

// HINT: trianble部分はRetinaディスプレイなどで途切れてしまう場合があるので
// 1pxほど大きめに描画してbody部分と被るようにしています。
const Base = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { border, color, fontSize } = themes

    return css`
      position: relative;
      display: inline-block;
      font-size: ${fontSize.S};
      border-radius: 4px;
      filter: drop-shadow(
        0 2px 2.5px rgba(0, 0, 0, 0.33)
      ); /* drop-shadow は spread-radius を受け付けないので shadow.LAYER2 に近い値をハードコーディングしている */
      white-space: nowrap;
      transform: translateZ(0); /* safari で filter を正しく描画するために必要 */

      &::after {
        display: block;
        position: absolute;
        content: '';
        background-color: ${color.WHITE};
      }

      background-color: ${color.WHITE};
      color: ${color.TEXT_BLACK};

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }

        &::before {
          display: block;
          position: absolute;
          content: '';
          background-color: ${color.TEXT_BLACK};
        }
      }

      &.top {
        &::before,
        &::after {
          top: -4px;
          width: 10px;
          height: 5px;
          clip-path: polygon(50% 0, 100% 100%, 0 100%);
        }

        &::before {
          top: -5px;
        }
      }
      &.bottom {
        &::before,
        &::after {
          bottom: -4px;
          width: 10px;
          height: 5px;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }

        &::before {
          bottom: -5px;
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
            left: -4px;
            width: 5px;
            height: 10px;
            clip-path: polygon(100% 0, 100% 100%, 0 50%);
          }

          &::before {
            left: -5px;
          }
        }
        &.right {
          &::before,
          &::after {
            right: -4px;
            width: 5px;
            height: 10px;
            clip-path: polygon(0 0, 100% 50%, 0 100%);
          }

          &::before {
            right: -5px;
          }
        }
      }
    `
  }}
`
