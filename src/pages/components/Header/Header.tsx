import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'
import { AppNavi, FaCaretDownIcon, LineUp, SmartHRLogo, Text } from '../../..'

const CustomLink: VFC<{ to: string; children: ReactNode }> = ({ to, children, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
)

const List: VFC = () => {
  return (
    <ListWrapper>
      <li>
        <button onClick={() => console.log('clicked item 1')}>ドロップダウンアイテム1</button>
      </li>
      <li>
        <button onClick={() => console.log('clicked item 2')}>ドロップダウンアイテム2</button>
      </li>
      <li>
        <button onClick={() => console.log('clicked item 3')}>ドロップダウンアイテム3</button>
      </li>
      <li>
        <button onClick={() => console.log('clicked item 4')}>ドロップダウンアイテム4</button>
      </li>
    </ListWrapper>
  )
}

const buttons = [
  {
    children: '現在ページ',
    current: true,
  },
  {
    children: 'ボタン',
    onClick: () => console.log('click'),
  },
  {
    children: 'アンカーリンク',
    href: 'http://www.google.com',
  },
  {
    children: 'ドロップダウン',
    icon: FaCaretDownIcon,
    dropdownContent: <List />,
  },
  {
    children: 'カスタムタグ',
    tag: CustomLink,
    to: 'http://www.google.com',
  },
]

export const Header: React.VFC = () => {
  return (
    <>
      <Wrapper>
        <LineUp align="space-between" vAlign="center">
          <LineUp vAlign="center" gap={0.5}>
            <a href="">
              <SmartHRLogo title="SmartHR" width={150} height={27} />
            </a>
          </LineUp>
          <NavigationItemWrapper>
            <Text>dummy name</Text>
          </NavigationItemWrapper>
        </LineUp>
      </Wrapper>
      <AppNavi buttons={buttons} />
    </>
  )
}

const Wrapper = styled.header(
  ({ theme: { color, space, width } }) => css`
    padding: 0 ${space(1.5)};
    height: fit-content;
    background-color: ${color.BRAND};
    color: ${color.TEXT_WHITE};
    @media (min-width: ${width.CONTENT.MAIN}) {
      padding-right: ${space(2)};
      padding-left: ${space(2)};
    }
  `,
)

const NavigationItemWrapper = styled.div(
  ({ theme: { space } }) =>
    css`
      padding: ${space(0.75)} ${space(0.5)};
    `,
)

const ListWrapper = styled.ul`
  ${({ theme: { space, color } }) => {
    return css`
      margin: 0;
      padding: ${space(0.5)};
      list-style: none;
      & > li > button {
        line-height: 40px;
        width: 100%;
        padding: 0 ${space(1.25)};
        border: none;
        background-color: ${color.WHITE};
        color: ${color.TEXT_BLACK};
        &:hover {
          background-color: ${color.hoverColor(color.WHITE)};
        }
      }
    `
  }}
`
