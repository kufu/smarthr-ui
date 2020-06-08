import React from 'react'
import styled, { css } from 'styled-components'

import { Theme } from '../../hooks/useTheme'

import { Icon, Props as IconProps } from '../Icon'

export const getIconComponent = (theme: Theme, icon?: IconProps['name'], current?: boolean) => {
  if (!icon) return null

  return (
    <IconWrapper themes={theme}>
      <Icon
        name={icon}
        size={14}
        color={current ? theme.palette.TEXT_BLACK : theme.palette.TEXT_GREY}
      />
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
const BaseStyle = css<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, font } = themes.size

    return css`
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 40px;
      padding: 0 0.4rem;
      background: none;
      border: none;
      font-size: ${pxToRem(font.TALL)};
      font-weight: bold;
      text-decoration: none;
    `
  }}
`
export const Active = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      ${BaseStyle}
      color: ${palette.TEXT_BLACK};
      position: relative;

      &::after {
        content: '';
        display: block;
        height: ${size.pxToRem(3)};
        background-color: ${palette.MAIN};
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
    `
  }}
`
export const InActiveStyle = css<{ themes: Theme }>`
  ${({ themes }) => {
    const { TEXT_GREY, hoverColor } = themes.palette

    return css`
      ${BaseStyle}
      color: ${TEXT_GREY};
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover{
        background-color: ${hoverColor('#fff')};
      }
    `
  }}
`
