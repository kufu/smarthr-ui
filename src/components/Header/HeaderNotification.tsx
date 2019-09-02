import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

export interface HeaderNotificationProps {
  number?: number
  url?: string
}

const HeaderNotificationComponent: React.FC<HeaderNotificationProps & InjectedProps> = ({
  theme,
  number = 0,
  url = '/notifications',
}) => (
  <Wrapper theme={theme}>
    <Anchor theme={theme} number={number} href={url} aria-label="通知履歴">
      {number && number >= 10 ? '9+' : number}
    </Anchor>
  </Wrapper>
)

export const HeaderNotification = withTheme(HeaderNotificationComponent)

const Wrapper: any = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      align-items: center;
      padding: 0 ${theme.size.pxToRem(10)};
    `
  }}
`

const Anchor: any = styled.a`
  ${({ theme, number }: InjectedProps & HeaderNotificationProps) => {
    return css`
      display: block;
      width: ${theme.size.pxToRem(29)};
      border-radius: ${theme.size.pxToRem(4)};
      background-color: ${number && number > 0 ? '#fcb156' : '#aaa'};
      color: #fff;
      font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
      line-height: ${theme.size.pxToRem(29)};
      text-align: center;
      text-decoration: none;
      transition: background-color 0.3s;

      &:hover {
        background-color: ${number && number > 0 ? '#ffc77b' : '#aaa'};
      }
    `
  }}
`
