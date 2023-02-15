import React, { ReactNode, TdHTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { isTouchDevice } from '../../libs/ua'

import { useThClassNames } from './useClassNames'

export type Props = {
  /** `true` のとき、セルの色をハイライトする */
  highlighted?: boolean
  /** セルの内容 */
  children?: ReactNode
  /** セルをクリックした時に発火するコールバック関数 */
  onClick?: () => void
}
type ElementProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, keyof Props>

export const Th: VFC<Props & ElementProps> = ({
  highlighted = false,
  className = '',
  onClick,
  children,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useThClassNames()
  const wrapperClass = [className, highlighted && 'highlighted', classNames.wrapper]
    .filter((c) => !!c)
    .join(' ')
  const actualChildren = onClick ? (
    <StyledButton themes={theme} onClick={onClick}>
      {children}
    </StyledButton>
  ) : (
    children
  )

  return (
    <StyledTh {...props} className={wrapperClass} themes={theme} isClickable={onClick}>
      {actualChildren}
    </StyledTh>
  )
}

const StyledTh = styled.th<{ themes: Theme; isClickable?: () => void }>`
  ${({ themes, isClickable }) => {
    const { fontSize, leading, spacingByChar, color, interaction } = themes

    return css`
      height: calc(1em * ${leading.NORMAL} + ${spacingByChar(0.5)} * 2);
      font-size: ${fontSize.S};
      font-weight: bold;
      padding: ${isClickable ? '0' : `${spacingByChar(0.5)} ${spacingByChar(1)}`};
      color: ${color.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`};
      text-align: left;
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;

      &.highlighted {
        background-color: ${color.hoverColor(color.HEAD)};
      }
    `
  }}
`

const StyledButton = styled.button<{ themes: Theme; onClick?: () => void }>`
  ${({ themes, onClick }) => {
    const { spacingByChar, color } = themes

    return css`
      appearance: none;
      box-sizing: border-box;
      cursor: pointer;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      border: 0;
      background-color: ${onClick ? color.hoverColor(color.HEAD) : 'transparent'};
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
    `
  }}
`
