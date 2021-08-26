import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

export type BalloonTheme = 'light' | 'dark'

export type Props = {
  horizontal: 'right' | 'center' | 'left'
  vertical: 'top' | 'middle' | 'bottom'
  className?: string
  children?: ReactNode
  as?: 'div' | 'span'
}

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const balloonFactory = (theme: BalloonTheme) => {
  const Balloon: VFC<Props & ElementProps> = ({
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
    const classNames = `${theme} ${horizontal} ${vertical} ${className} ${wrapper}`

    return <Base className={classNames} themes={themes} {...props} />
  }
  return Balloon
}

export const Balloon = balloonFactory('light')
/** @deprecated このコンポーネントは非推奨です。 Balloon コンポーネントを使用してください。 */
export const LightBalloon = Balloon
/** @deprecated このコンポーネントは非推奨です。 Balloon コンポーネントを使用してください。 */
export const DarkBalloon = balloonFactory('dark')

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

      &.light {
        background-color: #fff;
        color: ${color.TEXT_BLACK};
      }
      &.dark {
        background-color: ${color.TEXT_BLACK};
        color: #fff;
      }

      &.light.top {
        &::before {
          border-color: transparent transparent ${color.BORDER};
        }
        &::after {
          border-color: transparent transparent #fff;
        }
      }
      &.light.bottom {
        &::before {
          border-color: ${color.BORDER} transparent transparent;
        }
        &::after {
          border-color: #fff transparent transparent;
        }
      }

      &.dark.top {
        &::before,
        &::after {
          border-color: transparent transparent ${color.TEXT_BLACK};
        }
      }
      &.dark.bottom {
        &::before,
        &::after {
          border-color: ${color.TEXT_BLACK} transparent transparent;
        }
      }

      &.top {
        &::before,
        &::after {
          border-width: 0 5px 5px;
        }
        &::before {
          top: -5px;
        }
        &::after {
          top: -4px;
        }
      }
      &.bottom {
        &::before,
        &::after {
          border-width: 5px 5px 0;
        }
        &::before {
          bottom: -5px;
        }
        &::after {
          bottom: -4px;
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
          }
          &::after {
            left: -4px;
          }
          &.light {
            &::before {
              border-color: transparent ${color.BORDER} transparent transparent;
            }
            &::after {
              border-color: transparent #fff transparent transparent;
            }
          }
          &.dark {
            &::before,
            &::after {
              border-color: transparent ${color.TEXT_BLACK} transparent transparent;
            }
          }
        }
        &.right {
          &::before,
          &::after {
            border-width: 5px 0 5px 5px;
          }
          &::before {
            right: -5px;
          }
          &::after {
            right: -4px;
          }
          &.light {
            &::before {
              border-color: transparent transparent transparent ${color.BORDER};
            }
            &::after {
              border-color: transparent transparent transparent #fff;
            }
          }
          &.dark {
            &::before,
            &::after {
              border-color: transparent transparent transparent ${color.TEXT_BLACK};
            }
          }
        }
      }
    `
  }}
`
