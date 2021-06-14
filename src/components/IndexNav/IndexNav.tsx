import React, { OlHTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = { items: IndexNavItemProps[] }

export type IndexNavItemProps = {
  label: string
  href: string
  current?: boolean
  children?: IndexNavItemProps[]
}

type ElementProps = Omit<OlHTMLAttributes<HTMLOListElement>, keyof Props>

export const IndexNav: VFC<Props & ElementProps> = ({ items, className = '', ...props }) => {
  const themes = useTheme()
  const classNames = useClassNames()

  if (items.length === 0) return null

  return (
    <List {...props} themes={themes} className={`${className} ${classNames.wrapper}`}>
      {items.map((item, i) => (
        <Item key={i} themes={themes} className={classNames.item}>
          <Anchor
            href={item.href}
            current={item.current}
            aria-current={item.current ? 'page' : undefined}
            themes={themes}
            className={classNames.anchor}
          >
            {item.label}
          </Anchor>

          {item.children && <IndexNav items={item.children} />}
        </Item>
      ))}
    </List>
  )
}

const List = styled.ol<{ themes: Theme }>(({ themes: { fontSize } }) => {
  return css`
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: ${fontSize.M};
  `
})
const Item = styled.li<{ themes: Theme }>(({ themes }) => {
  const { fontSize, spacingByChar } = themes

  return css`
    line-height: 1em;

    &:not(:first-child) {
      margin-top: ${spacingByChar(1)};
    }

    & > ${List} {
      margin-top: ${spacingByChar(1)};
      margin-left: ${spacingByChar(1.5)};
      font-size: ${fontSize.S};
    }
  `
})
const Anchor = styled.a<{ themes: Theme; current?: boolean }>(({ themes, current }) => {
  const { color, spacingByChar } = themes

  return css`
    display: inline-block;
    padding-left: ${spacingByChar(0.5)};
    border-left: 2px solid;
    border-color: ${current ? color.MAIN : 'transparent'};
    line-height: 1em;
    color: ${color.TEXT_BLACK};
    font-weight: ${current ? 'bold' : 'normal'};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  `
})
