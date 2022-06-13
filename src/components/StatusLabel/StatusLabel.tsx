import React, { FC, HTMLAttributes, ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { FaExclamationCircleIcon, FaExclamationTriangleIcon } from '../Icon'

type Color = 'grey' | 'blue' | 'red'
type State = 'warning' | 'error'
type Props = {
  /** ラベルが表す状態の種類 */
  type?: Color | State
  /** 強調するかどうか */
  bold?: boolean
  /** ラベル */
  children: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLSpanElement>, keyof Props>

export const StatusLabel: FC<Props & ElementProps> = ({
  type = 'grey',
  bold = false,
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()
  const Icon = useMemo(() => {
    switch (true) {
      case type === 'warning' && bold: {
        return FaExclamationTriangleIcon
      }
      case type === 'error' && bold: {
        return FaExclamationCircleIcon
      }
      default: {
        return React.Fragment
      }
    }
  }, [type, bold])

  return (
    <Wrapper
      {...props}
      themes={theme}
      className={`${type}${bold ? ' bold' : ''} ${className} ${classNames.wrapper}`}
    >
      <Icon />
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.span<{ themes: Theme }>`
  ${({ themes: { border, color, fontSize, spacingByChar } }) =>
    css`
      box-sizing: content-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: ${spacingByChar(0.25)};
      border: ${border.lineWidth} solid transparent;
      background-color: ${color.WHITE};
      padding: ${spacingByChar(0.25)} ${spacingByChar(0.5)};
      white-space: nowrap;
      font-size: ${fontSize.S};
      font-weight: bold;

      /** ラベルが天地中央に揃わないため暫定対応 */
      line-height: 0;
      min-width: 3.5em;
      min-height: 1em;

      &.grey {
        border-color: ${color.BORDER};
        color: ${color.TEXT_GREY};

        &.bold {
          border-color: ${color.TEXT_GREY};
          background-color: ${color.TEXT_GREY};
          color: ${color.TEXT_WHITE};
        }
      }

      &.blue {
        border-color: ${color.MAIN};
        color: ${color.MAIN};

        &.bold {
          background-color: ${color.MAIN};
          color: ${color.TEXT_WHITE};
        }
      }

      &.red {
        border-color: ${color.DANGER};
        color: ${color.DANGER};
      }
      &.red.bold,
      &.error {
        background-color: ${color.DANGER};
        color: ${color.TEXT_WHITE};
      }

      &.warning {
        background-color: ${color.WARNING_YELLOW};
        color: ${color.TEXT_BLACK};

        &.bold {
          border-color: ${color.TEXT_BLACK};
        }
      }
    `}
`
