import * as React from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

export interface HeaderNotificationProps {
  number?: number
  url?: string
}

export const HeaderNotification: React.FC<HeaderNotificationProps> = ({
  number = 0,
  url = '/notifications',
}) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      <Anchor themes={theme} number={number} href={url} aria-label="通知履歴">
        {number && number >= 10 ? '9+' : number}
      </Anchor>
    </Wrapper>
  )
}

const Wrapper: any = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes
    return css`
      display: flex;
      align-items: center;
      padding: 0 ${size.pxToRem(10)};
    `
  }}
`

const Anchor: any = styled.a<{ themes: Theme; number: HeaderNotificationProps }>`
  ${({ themes, number }) => {
    const { size } = themes

    return css`
      display: block;
      width: ${size.pxToRem(29)};
      border-radius: ${size.pxToRem(4)};
      background-color: ${number && number > 0 ? '#fcb156' : '#aaa'};
      color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      line-height: ${size.pxToRem(29)};
      text-align: center;
      text-decoration: none;
      transition: background-color 0.3s;

      &:hover {
        background-color: ${number && number > 0 ? '#ffc77b' : '#aaa'};
      }
    `
  }}
`
