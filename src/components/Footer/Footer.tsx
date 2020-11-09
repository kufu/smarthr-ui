import React from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

export const Footer = () => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      <List themes={theme}>
        <li>
          <Item href="https://smarthr.jp/help" target="_blank" rel="noopener noreferrer">
            ヘルプ
          </Item>
        </li>
        <li>
          <Item href="https://smarthr.jp/info" target="_blank" rel="noopener noreferrer">
            お知らせ
          </Item>
        </li>
        <li>
          <Item href="https://smarthr.jp/terms" target="_blank" rel="noopener noreferrer">
            利用規約
          </Item>
        </li>
        <li>
          <Item href="https://smarthr.jp/policy" target="_blank" rel="noopener noreferrer">
            プライバシーポリシー
          </Item>
        </li>
        <li>
          <Item href="https://smarthr.jp/law" target="_blank" rel="noopener noreferrer">
            特定商取引法に基づく表記
          </Item>
        </li>
        <li>
          <Item href="https://smarthr.co.jp" target="_blank" rel="noopener noreferrer">
            運営会社
          </Item>
        </li>
        <li>
          <Item href="https://developer.smarthr.jp" target="_blank" rel="noopener noreferrer">
            開発者向けAPI
          </Item>
        </li>
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
const Item = styled.a`
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
