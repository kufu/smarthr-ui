import React from 'react'
import styled, { css } from 'styled-components'

import { Theme } from '../../hooks/useTheme'

import { Icon, Props as IconProps } from '../Icon'

export const getIconComponent = (
  theme: Theme,
  options?: { icon?: IconProps['name']; current?: boolean },
) => {
  const opts = {
    icon: null,
    current: false,
    ...options,
  }
  const { TEXT_BLACK, TEXT_GREY } = theme.palette

  if (!opts.icon) return null

  return (
    <IconWrapper themes={theme}>
      <Icon name={opts.icon} size={14} color={opts.current ? TEXT_BLACK : TEXT_GREY} />
    </IconWrapper>
  )
}

const IconWrapper = styled.figure<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: flex;
      padding: 0;
      margin: 0 ${pxToRem(space.XXS)} 0 0;
    `
  }}
`
export type ItemStyleProps = {
  themes: Theme
  isActive?: boolean
  isUnclickable?: boolean
}
export function getItemStyle({ themes, isActive, isUnclickable }: ItemStyleProps) {
  const { pxToRem, font } = themes.size
  const { hoverColor, MAIN, TEXT_BLACK, TEXT_GREY } = themes.palette

  return css`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 40px;
    padding: 0 0.4rem;
    margin: 0;
    background: none;
    border: none;
    color: ${TEXT_GREY};
    font-size: ${pxToRem(font.TALL)};
    font-weight: bold;
    text-decoration: none;
    transition: background-color 0.3s;
    ${isActive &&
    css`
      color: ${TEXT_BLACK};
      position: relative;
      &::after {
        content: '';
        display: block;
        height: ${pxToRem(3)};
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
        background-color: ${hoverColor('#fff')};
      }
    `}
  `
}
