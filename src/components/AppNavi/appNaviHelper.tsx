import React from 'react'
import { css } from 'styled-components'

import { Theme } from '../../hooks/useTheme'

import { ComponentProps as IconProps } from '../Icon'

export const getIconComponent = (
  theme: Theme,
  options?: { icon?: React.ComponentType<IconProps>; current?: boolean },
) => {
  const opts = {
    icon: null,
    current: false,
    ...options,
  }
  const { TEXT_BLACK, TEXT_GREY } = theme.color

  if (!opts.icon) return null

  const Icon = opts.icon

  const iconProps = {
    size: 14,
    color: opts.current ? TEXT_BLACK : TEXT_GREY,
  }

  return <Icon {...iconProps} />
}

export type ItemStyleProps = {
  themes: Theme
  isActive?: boolean
  isUnclickable?: boolean
}
export function getItemStyle({ themes, isActive, isUnclickable }: ItemStyleProps) {
  const { fontSize, color, spacingByChar, leading } = themes
  const { hoverColor, MAIN, TEXT_BLACK, TEXT_GREY } = color

  return css`
    display: flex;
    align-items: center;
    gap: ${spacingByChar(0.5)};
    padding: ${spacingByChar(0.75)} ${spacingByChar(0.5)};
    margin: 0;
    background: none;
    border: none;
    color: ${TEXT_GREY};
    font-size: ${fontSize.M};
    font-weight: bold;
    line-height: ${leading.NONE};
    text-decoration: none;
    ${isActive &&
    css`
      color: ${TEXT_BLACK};
      position: relative;
      &::after {
        content: '';
        display: block;
        height: calc(${spacingByChar(0.25)} / 2);
        background-color: ${MAIN};
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
    `}
    ${!isUnclickable &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${hoverColor(color.WHITE)};
      }
    `}
  `
}
