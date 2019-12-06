import React, { ReactNode, FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

type BalloonTheme = 'light' | 'dark'
type Props = {
  horizontal: 'right' | 'center' | 'left'
  vertical: 'top' | 'middle' | 'bottom'
  className?: string
  children?: ReactNode
}

const balloonFactory: (theme: BalloonTheme) => FC<Props> = theme => ({
  horizontal,
  vertical,
  className = '',
  ...props
}) => {
  if (horizontal === 'center' && vertical === 'middle') {
    throw new Error('"vertical" can not be specified as "middle" when "horizontal" is "center".')
  }

  const themes = useTheme()
  const classNames = `${theme} ${horizontal} ${vertical} ${className}`

  return <Base className={classNames} themes={themes} {...props} />
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
          border-width: 0 8px 8px;
        }
        &::before {
          top: -8px;
        }
        &::after {
          top: -7px;
        }
      }
      &.bottom {
        &::before,
        &::after {
          border-width: 8px 8px 0;
        }
        &::before {
          bottom: -8px;
        }
        &::after {
          bottom: -7px;
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
          transform: translateX(-8px);
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
          transform: translateY(-8px);
        }
        &.left {
          &::before,
          &::after {
            border-width: 8px 8px 8px 0;
          }
          &::before {
            left: -8px;
          }
          &::after {
            left: -7px;
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
            border-width: 8px 0 8px 8px;
          }
          &::before {
            right: -8px;
          }
          &::after {
            right: -7px;
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
