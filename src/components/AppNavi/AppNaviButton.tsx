import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { Icon, Props as IconProps } from '../Icon/Icon'

type ClickEvent = {
  preventDefault: () => void
}
export type AppNaviButtonProps = {
  children: React.ReactNode
  icon?: IconProps['name']
  onClick?: (e: ClickEvent) => void
  current?: boolean
}

export const AppNaviButton: FC<AppNaviButtonProps> = ({ current, icon, onClick, children }) => {
  const theme = useTheme()
  return (
    <Wrapper themes={theme}>
      {current ? (
        <CurrentWrapper themes={theme} aria-selected="true">
          {icon && (
            <IconWrapper themes={theme}>
              <Icon name={icon} size={14} color={theme.palette.TEXT_BLACK} />
            </IconWrapper>
          )}
          {children}
        </CurrentWrapper>
      ) : (
        <ButtonWrapper themes={theme} onClick={onClick}>
          {icon && (
            <IconWrapper themes={theme}>
              <Icon name={icon} size={14} color={theme.palette.TEXT_GREY} />
            </IconWrapper>
          )}
          {children}
        </ButtonWrapper>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    return css`
      display: inline-block;
      margin-right: ${themes.size.pxToRem(4)};
    `
  }}
`
const BaseStyle = css<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space, font } = themes.size

    return css`
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: ${pxToRem(40)};
      padding: 0 ${pxToRem(space.XXS)};
      background: none;
      border: none;
      font-size: ${pxToRem(font.TALL)};
      font-weight: bold;
      text-decoration: none;
    `
  }}
`
const CurrentWrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      ${BaseStyle}
      color: ${palette.TEXT_BLACK};
      position: relative;

      &::after{
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
const ButtonWrapper = styled.button<{ themes: Theme }>`
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
const IconWrapper = styled.figure<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: inline-block;
      padding: 0;
      margin: 0 ${pxToRem(space.XXS)} 0 0;
    `
  }}
`
