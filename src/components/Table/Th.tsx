import React, { ReactNode, TdHTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useThClassNames } from './useClassNames'

export type Props = {
  highlighted?: boolean
  children?: ReactNode
  onClick?: () => void
}
type ElementProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, keyof Props>

export const Th: VFC<Props & ElementProps> = ({
  highlighted = false,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useThClassNames()
  const wrapperClass = [className, highlighted && 'highlighted', classNames.wrapper]
    .filter((c) => !!c)
    .join(' ')

  return <StyledTh {...props} className={wrapperClass} themes={theme} />
}

const StyledTh = styled.th<{ themes: Theme; onClick?: () => void }>`
  ${({ themes, onClick }) => {
    const { fontSize, size, spacingByChar, color, interaction } = themes

    return css`
      height: ${size.pxToRem(40)};
      font-size: ${fontSize.S};
      font-weight: bold;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      color: ${color.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`};
      text-align: left;
      line-height: 1.5;
      vertical-align: middle;
      box-sizing: border-box;

      &.highlighted {
        background-color: ${color.hoverColor(color.HEAD)};
      }

      ${onClick &&
      css`
        :hover {
          background-color: ${color.hoverColor(color.HEAD)};
          cursor: pointer;
        }
      `}
    `
  }}
`
