import * as React from 'react'
import styled, { css } from 'styled-components'

import { withTheme, InjectedProps } from '../../hocs/withTheme'

type BalloonTheme = 'light' | 'dark'

interface Props {
  className?: string
  horizontal: 'right' | 'center' | 'left'
  vertical: 'top' | 'middle' | 'bottom'
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
    const { palette, frame } = theme

    return css`
      position: relative;
      display: inline-block;
      border-radius: ${frame.border.radius};
      box-shadow: rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px;
      white-space: nowrap;

      &::before,
      &::after {
        display: block;
        position: absolute;
        border-style: ${frame.border.lineStyle};
        content: '';
      }

      &.light {
        border: ${frame.border.default};
        background-color: ${palette.base};
        color: ${palette.default};
      }
      &.dark {
        background-color: ${palette.default};
        color: ${palette.base};
      }

      &.light.top {
        &::before {
          border-color: transparent transparent ${palette.line};
        }
        &::after {
          border-color: transparent transparent ${palette.base};
        }
      }
      &.light.bottom {
        &::before {
          border-color: ${palette.line} transparent transparent;
        }
        &::after {
          border-color: ${palette.base} transparent transparent;
        }
      }

      &.dark.top {
        &::before,
        &::after {
          border-color: transparent transparent ${palette.default};
        }
      }
      &.dark.bottom {
        &::before,
        &::after {
          border-color: ${palette.default} transparent transparent;
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
              border-color: transparent ${palette.line} transparent transparent;
            }
            &::after {
              border-color: transparent ${palette.base} transparent transparent;
            }
          }
          &.dark {
            &::before,
            &::after {
              border-color: transparent ${palette.default} transparent transparent;
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
              border-color: transparent transparent transparent ${palette.line};
            }
            &::after {
              border-color: transparent transparent transparent ${palette.base};
            }
          }
          &.dark {
            &::before,
            &::after {
              border-color: transparent transparent transparent ${palette.default};
            }
          }
        }
      }
    `
  }}
`
