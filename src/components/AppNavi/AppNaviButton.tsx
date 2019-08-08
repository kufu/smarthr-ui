import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { Icon, Props as IconProps } from '../Icon/Icon'

export interface AppNaviButtonProps {
  label: string
  icon?: IconProps['name']
  url?: string
  target?: string
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
            <Icon name={props.icon} size={14} color={theme.palette.TextBlack} />
          </IconWrapper>
        )}
        {props.label}
      </CurrentWrapper>
    ) : (
      <AnchorWrapper theme={theme} href={props.url} target={props.target ? props.target : '_self'}>
        {props.icon && (
          <IconWrapper theme={theme}>
            <Icon name={props.icon} size={14} color={theme.palette.TextGrey} />
          </IconWrapper>
        )}
        {props.label}
      </AnchorWrapper>
    )}
  </Wrapper>
)

export const AppNaviButton = withTheme(AppNaviButtonComponent)

const Wrapper: any = styled.div`
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
      font-size: ${theme.size.font.tall};
      font-weight: bold;
      text-decoration: none;
    `
  }}
`

const CurrentWrapper: any = styled.span`
  ${({ theme }: InjectedProps) => {
    return css`
      ${BaseStyle}
      border-bottom: ${theme.size.pxToRem(2)} solid ${theme.palette.Main};
      color: ${theme.palette.TextBlack};
    `
  }}
`

const AnchorWrapper: any = styled.a`
  ${({ theme }: InjectedProps) => {
    return css`
      ${BaseStyle}
      color: ${theme.palette.TextGrey};
      transition: background-color 0.3s;

      &:hover{
        background-color: ${theme.palette.hoverColor('#fff')};
      }
    `
  }}
`

const IconWrapper: any = styled.figure`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      padding: 0;
      margin: 0 ${theme.size.pxToRem(theme.size.space.xxs)} 0 0;
    `
  }}
`
