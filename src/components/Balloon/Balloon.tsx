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

export const LightBalloon = balloonFactory('light')
export const DarkBalloon = balloonFactory('dark')

const Base = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette, frame, size } = themes

    return css`
      position: relative;
      display: inline-block;
      font-size: ${size.pxToRem(size.font.SHORT)};
      border-radius: 4px;
      box-shadow: 0 2px 8px 0 rgba(51, 51, 51, 0.35);
      white-space: nowrap;

      &::before,
      &::after {
        display: block;
        position: absolute;
        border-style: ${frame.border.lineStyle};
        content: '';
      }

      &.light {
        background-color: #fff;
        color: ${palette.TEXT_BLACK};
      }
      &.dark {
        background-color: ${palette.TEXT_BLACK};
        color: #fff;
      }

      &.light.top {
        &::before {
          border-color: transparent transparent ${palette.BORDER};
        }
        &::after {
          border-color: transparent transparent #fff;
        }
      }
      &.light.bottom {
        &::before {
          border-color: ${palette.BORDER} transparent transparent;
        }
        &::after {
          border-color: #fff transparent transparent;
        }
      }

      &.dark.top {
        &::before,
        &::after {
          border-color: transparent transparent ${palette.TEXT_BLACK};
        }
      }
      &.dark.bottom {
        &::before,
        &::after {
          border-color: ${palette.TEXT_BLACK} transparent transparent;
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
              border-color: transparent ${palette.BORDER} transparent transparent;
            }
            &::after {
              border-color: transparent #fff transparent transparent;
            }
          }
          &.dark {
            &::before,
            &::after {
              border-color: transparent ${palette.TEXT_BLACK} transparent transparent;
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
              border-color: transparent transparent transparent ${palette.BORDER};
            }
            &::after {
              border-color: transparent transparent transparent #fff;
            }
          }
          &.dark {
            &::before,
            &::after {
              border-color: transparent transparent transparent ${palette.TEXT_BLACK};
            }
          }
        }
      }
    `
  }}
`
