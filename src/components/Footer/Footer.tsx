import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

export const Footer: VFC = () => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      <List themes={theme}>
        <Item href="https://smarthr.jp/help">ヘルプ</Item>
        <Item href="https://smarthr.jp/info">お知らせ</Item>
        <Item href="https://smarthr.jp/terms">利用規約</Item>
        <Item href="https://smarthr.jp/policy">プライバシーポリシー</Item>
        <Item href="https://smarthr.jp/law">特定商取引法に基づく表記</Item>
        <Item href="https://smarthr.co.jp">運営会社</Item>
        <Item href="https://developer.smarthr.jp">開発者向けAPI </Item>
      </List>
      <Copy themes={theme}>&copy; SmartHR, Inc.</Copy>
    </Wrapper>
  )
}

const Wrapper = styled.footer<{ themes: Theme }>`
  ${({ themes }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 ${themes.size.pxToRem(themes.size.space.S)};
    background-color: ${themes.palette.BRAND};
    color: #fff;
    font-size: ${themes.size.pxToRem(themes.size.font.TALL)};
  `}
`

const List = styled.ul<{ themes: Theme }>`
  ${({ themes }) => css`
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;

    > li:not(:first-child) {
      margin-left: ${themes.size.pxToRem(themes.size.space.XXS)};
    }
  `}
`

type ItemProp = {
  children: ReactNode
  href: string
}
const Item: React.VFC<ItemProp> = ({ children, href }) => (
  <li>
    <ItemPart target="_blank" rel="noopener noreferrer" href={href}>
      {children}
    </ItemPart>
  </li>
)
const ItemPart = styled.a`
  color: #fff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Copy = styled.small<{ themes: Theme }>`
  ${({ themes }) => css`
    font-size: ${themes.size.pxToRem(themes.size.font.TALL)};
  `}
`
