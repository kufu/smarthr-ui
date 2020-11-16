import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = { items: IndexNavItemProps[] }

export type IndexNavItemProps = {
  label: string
  href: string
  children?: IndexNavItemProps[]
  current?: boolean
}

export const IndexNav: FC<Props> = ({ items }) => {
  const themes = useTheme()
  if (items.length === 0) {
    return null
  }

  return (
    <List themes={themes}>
      {items.map((item, i) => (
        <Item key={i} themes={themes}>
          <Anchor
            href={item.href}
            current={item.current}
            aria-current={item.current ? 'page' : undefined}
            themes={themes}
          >
            {item.label}
          </Anchor>
          {item.children && <IndexNav items={item.children} />}
        </Item>
      ))}
    </List>
  )
}

const List = styled.ul<{ themes: Theme }>(({ themes }) => {
  const { size } = themes
  return css`
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: ${size.pxToRem(size.font.TALL)};
  `
})
const Item = styled.li<{ themes: Theme }>(({ themes }) => {
  const { size } = themes
  return css`
    line-height: 1em;
    &:not(:first-child) {
      margin-top: ${size.pxToRem(size.space.XS)};
    }
    & > ${List} {
      margin-top: ${size.pxToRem(size.space.XS)};
      margin-left: ${size.pxToRem(size.space.S)};
      font-size: ${size.pxToRem(size.font.SHORT)};
    }
  `
})
const Anchor = styled.a<{ themes: Theme; current?: boolean }>(({ themes, current }) => {
  const { palette, size } = themes
  return css`
    display: inline-block;
    padding-left: ${size.pxToRem(size.space.XXS)};
    border-left: 2px solid;
    border-color: ${current ? palette.MAIN : 'transparent'};
    line-height: 1em;
    color: ${palette.TEXT_BLACK};
    font-weight: ${current ? 'bold' : 'normal'};
    text-decoration: none;
    :hover {
      text-decoration: underline;
    }
  `
})
