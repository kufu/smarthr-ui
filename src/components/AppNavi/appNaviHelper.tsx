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
    color: opts.current ? TEXT_BLACK : TEXT_GREY,
  }

  return <Icon {...iconProps} />
}

export type ItemStyleProps = {
  themes: Theme
  isActive?: boolean
  isUnclickable?: boolean
}
export const getItemStyle = ({
  themes: {
    color: { hoverColor, MAIN, TEXT_BLACK, TEXT_GREY, WHITE },
    fontSize,
    leading,
    spacingByChar,
  },
  isActive,
  isUnclickable,
}: ItemStyleProps) =>
  css`
    display: flex;
    align-items: center;
    gap: ${spacingByChar(0.5)};
    margin: 0;
    border: none;
    background-color: transparent;
    padding: ${spacingByChar(0.75)} ${spacingByChar(0.5)};
    text-decoration: none;
    font-size: ${fontSize.M};
    font-weight: bold;
    line-height: ${leading.NONE};
    color: ${TEXT_GREY};

    ${isActive &&
    css`
      color: ${TEXT_BLACK};
      position: relative;
      &::after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        background-color: ${MAIN};
        height: ${spacingByChar(0.25)};
      }
    `}
    ${!isUnclickable &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${hoverColor(WHITE)};
      }
    `}
  `
