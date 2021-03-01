import React, { HTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  children?: React.ReactNode
}

type ElementProps = Omit<HTMLAttributes<HTMLUListElement>, keyof Props>

const BackgroundJobsList: VFC<Props & ElementProps> = ({ children, className = '' }) => {
  const themes = useTheme()
  return (
    <List themes={themes} className={className}>
      {children}
    </List>
  )
}

const Item = styled.li``
const List = styled.ul<{ themes: Theme }>(({ themes }) => {
  const { pxToRem, space } = themes.size
  return css`
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: ${pxToRem(space.XS)};
    list-style: none;

    ${Item} {
      :not(:first-child) {
        margin-top: ${pxToRem(space.XS)};
      }
    }
  `
})

const ListAndItem: typeof BackgroundJobsList & { Item: typeof Item } = Object.assign(
  BackgroundJobsList,
  {
    Item,
  },
)
export { ListAndItem as BackgroundJobsList }
