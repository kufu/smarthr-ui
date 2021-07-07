import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type ElementProps = HTMLAttributes<HTMLElement>

export const Footer: VFC<ElementProps> = ({ className = '', ...props }) => {
  const theme = useTheme()
  const { wrapper, list, listItem } = useClassNames()

  return (
    <Wrapper themes={theme} className={`${wrapper} ${className}`} {...props}>
      <List themes={theme} className={list}>
        <Item href="https://smarthr.jp/help" className={listItem}>
          ヘルプ
        </Item>
        <Item href="https://smarthr.jp/info" className={listItem}>
          お知らせ
        </Item>
        <Item href="https://smarthr.jp/terms" className={listItem}>
          利用規約
        </Item>
        <Item href="https://smarthr.jp/policy" className={listItem}>
          プライバシーポリシー
        </Item>
        <Item href="https://smarthr.jp/law" className={listItem}>
          特定商取引法に基づく表記
        </Item>
        <Item href="https://smarthr.co.jp" className={listItem}>
          運営会社
        </Item>
        <Item href="https://developer.smarthr.jp" className={listItem}>
          開発者向けAPI{' '}
        </Item>
      </List>
      <Copy themes={theme}>&copy; SmartHR, Inc.</Copy>
    </Wrapper>
  )
}

const Wrapper = styled.footer<{ themes: Theme }>`
  ${({ themes: { color, fontSize, spacingByChar } }) => css`
    overflow: hidden;
    padding: ${spacingByChar(1)} ${spacingByChar(1.5)};
    background-color: ${color.BRAND};
    color: #fff;
    font-size: ${fontSize.M};
    white-space: nowrap;
  `}
`

const List = styled.ul<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    float: left;
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

const Item: VFC<ItemProp> = ({ children, href, className = '' }) => (
  <li className={className}>
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
    float: right;
    font-size: ${themes.fontSize.M};
  `}
`
