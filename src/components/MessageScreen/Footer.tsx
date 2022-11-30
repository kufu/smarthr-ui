import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useClassNames } from './useClassNames'

type ElementProps = HTMLAttributes<HTMLElement>

export const Footer: VFC<ElementProps> = ({ className = '', ...props }) => {
  const theme = useTheme()
  const { footer } = useClassNames()

  return (
    <Wrapper {...props} themes={theme} className={`${footer} ${className}`}>
      <List themes={theme}>
        <Item href="https://support.smarthr.jp/">ヘルプ</Item>
        <Item href="https://smarthr.jp/update/">お知らせ</Item>
        <Item href="https://smarthr.jp/terms/">利用規約</Item>
        <Item href="https://smarthr.co.jp/privacy/">プライバシーポリシー</Item>
        <Item href="https://smarthr.jp/law/">特定商取引法に基づく表記</Item>
        <Item href="https://smarthr.co.jp">運営会社</Item>
        <Item href="https://developer.smarthr.jp">開発者向けAPI </Item>
      </List>
      <Copy themes={theme}>&copy; SmartHR, Inc.</Copy>
    </Wrapper>
  )
}

const Wrapper = styled.footer<{ themes: Theme }>`
  ${({ themes: { color, fontSize, spacingByChar } }) => css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: ${spacingByChar(1)} ${spacingByChar(1.5)};
    background-color: ${color.BRAND};
    color: ${color.TEXT_WHITE};
    font-size: ${fontSize.M};
  `}
`

const List = styled.ul<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;

    > li {
      padding: 3px 0;
      margin-right: ${spacingByChar(0.5)};
    }
  `}
`

type ItemProp = {
  children: ReactNode
  href: string
  className?: string
}

const Item: VFC<ItemProp> = ({ children, href, className = '' }) => {
  const theme = useTheme()
  return (
    <li className={className}>
      <ItemAnchor themes={theme} target="_blank" rel="noopener noreferrer" href={href}>
        {children}
      </ItemAnchor>
    </li>
  )
}

const ItemAnchor = styled.a<{ themes: Theme }>`
  color: ${({ themes }) => themes.color.TEXT_WHITE};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Copy = styled.small<{ themes: Theme }>`
  ${({ themes }) => css`
    margin-left: auto;
    font-size: ${themes.fontSize.M};
  `}
`
