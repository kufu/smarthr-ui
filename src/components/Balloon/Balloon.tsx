import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

type BalloonTheme = 'light' | 'dark'

interface Props {
  horizontal: 'right' | 'center' | 'left'
  vertical: 'top' | 'middle' | 'bottom'
  className?: string
  children?: React.ReactNode
}

const balloonFactory: (theme: BalloonTheme) => React.FC<Props & InjectedProps> = theme => ({
  horizontal,
  vertical,
  className = '',
  ...props
}) => {
  if (horizontal === 'center' && vertical === 'middle') {
    throw new Error('"vertical" can not be specified as "middle" when "horizontal" is "center".')
  }

  const classNames = `${theme} ${horizontal} ${vertical} ${className}`

  return <Base className={classNames} {...props} />
}

export const LightBalloon = withTheme(balloonFactory('light'))
export const DarkBalloon = withTheme(balloonFactory('dark'))

const Base = styled.div`
  ${({ theme }: InjectedProps) => {
    const { palette, frame, size } = theme

    return css`
      position: relative;
      display: inline-block;
      font-size: ${size.pxToRem(size.font.tasting)};
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
        color: ${palette.Black};
      }
      &.dark {
        background-color: ${palette.Black};
        color: #fff;
      }

      &.light.top {
        &::before {
          border-color: transparent transparent ${palette.Mono_P20};
        }
        &::after {
          border-color: transparent transparent #fff;
        }
      }
      &.light.bottom {
        &::before {
          border-color: ${palette.Mono_P20} transparent transparent;
        }
        &::after {
          border-color: #fff transparent transparent;
        }
      }

      &.dark.top {
        &::before,
        &::after {
          border-color: transparent transparent ${palette.Black};
        }
      }
      &.dark.bottom {
        &::before,
        &::after {
          border-color: ${palette.Black} transparent transparent;
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
              border-color: transparent ${palette.Mono_P20} transparent transparent;
            }
            &::after {
              border-color: transparent #fff transparent transparent;
            }
          }
          &.dark {
            &::before,
            &::after {
              border-color: transparent ${palette.Black} transparent transparent;
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
              border-color: transparent transparent transparent ${palette.Mono_P20};
            }
            &::after {
              border-color: transparent transparent transparent #fff;
            }
          }
          &.dark {
            &::before,
            &::after {
              border-color: transparent transparent transparent ${palette.Black};
            }
          }
        }
      }
    `
  }}
`
