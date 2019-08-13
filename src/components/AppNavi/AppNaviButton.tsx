import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { Icon, Props as IconProps } from '../Icon/Icon'

interface ClickEvent {
  preventDefault: () => void
}

export interface AppNaviButtonProps {
  children: React.ReactNode
  icon?: IconProps['name']
  onClick?: (e: ClickEvent) => void
  current?: boolean
}

const AppNaviButtonComponent: React.FC<AppNaviButtonProps & InjectedProps> = ({
  theme,
  ...props
}) => (
  <Wrapper theme={theme}>
    {props.current ? (
      <CurrentWrapper theme={theme} aria-selected="true">
        {props.icon && (
          <IconWrapper theme={theme}>
            <Icon name={props.icon} size={14} color={theme.palette.TEXT_BLACK} />
          </IconWrapper>
        )}
        {props.children}
      </CurrentWrapper>
    ) : (
      <ButtonWrapper theme={theme} onClick={props.onClick}>
        {props.icon && (
          <IconWrapper theme={theme}>
            <Icon name={props.icon} size={14} color={theme.palette.TEXT_GREY} />
          </IconWrapper>
        )}
        {props.children}
      </ButtonWrapper>
    )}
  </Wrapper>
)

export const AppNaviButton = withTheme(AppNaviButtonComponent)

const Wrapper = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      margin-right: ${theme.size.pxToRem(4)};
    `
  }}
`

const BaseStyle = css`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: ${theme.size.pxToRem(40)};
      padding: 0 ${theme.size.pxToRem(theme.size.space.xxs)};
      background: none;
      border: none;
      font-size: ${theme.size.pxToRem(theme.size.font.tall)};
      font-weight: bold;
      text-decoration: none;
    `
  }}
`

const CurrentWrapper = styled.span`
  ${({ theme }: InjectedProps) => {
    return css`
      ${BaseStyle}
      border-bottom: ${theme.size.pxToRem(3)} solid ${theme.palette.MAIN};
      color: ${theme.palette.TEXT_BLACK};
    `
  }}
`

const ButtonWrapper = styled.button`
  ${({ theme }: InjectedProps) => {
    return css`
      ${BaseStyle}
      color: ${theme.palette.TEXT_GREY};
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover{
        background-color: ${theme.palette.hoverColor('#fff')};
      }
    `
  }}
`

const IconWrapper = styled.figure`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      padding: 0;
      margin: 0 ${theme.size.pxToRem(theme.size.space.xxs)} 0 0;
    `
  }}
`
