import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { IndexNavList } from './IndexNavList'

type Props = {
  label: string
  href: string
  current?: boolean
  className?: string
}

export const IndexNavItem: FC<Props> = ({ label, href, current, children, ...props }) => {
  const themes = useTheme()
  return (
    <Item themes={themes} {...props}>
      <Anchor href={href} className={current ? 'current' : undefined} themes={themes}>
        {label}
      </Anchor>
      {children && <IndexNavList>{children}</IndexNavList>}
    </Item>
  )
}

const Item = styled.li<{ themes: Theme }>(({ themes }) => {
  const { size } = themes
  return css`
    line-height: 1em;
    &:not(:first-child) {
      margin-top: ${size.pxToRem(size.space.XS)};
    }
    & > ul {
      margin-top: ${size.pxToRem(size.space.XS)};
      margin-left: ${size.pxToRem(size.space.S)};
      font-size: ${size.pxToRem(size.font.SHORT)};
    }
  `
})
const Anchor = styled.a<{ themes: Theme }>(({ themes }) => {
  const { palette, size } = themes
  return css`
    display: inline-block;
    padding-left: ${size.pxToRem(size.space.XXS)};
    border-left: 2px solid;
    border-color: transparent;
    line-height: 1em;
    color: ${palette.TEXT_BLACK};
    font-weight: normal;
    text-decoration: none;
    :hover {
      text-decoration: underline;
    }

    &.current {
      border-color: ${palette.MAIN};
      font-weight: bold;
    }
  `
})
