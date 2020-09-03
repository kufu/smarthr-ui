import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  className?: string
}

const BackgroundJobsList: FC<Props> = ({ children, className }) => {
  const themes = useTheme()
  return (
    <List themes={themes} className={className}>
      {children}
    </List>
  )
}

const BackgroundJobsListItem = styled.li``
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

    ${BackgroundJobsListItem} {
      :not(:first-child) {
        margin-top: ${pxToRem(space.XS)};
      }
    }
  `
})

const ListAndItem: typeof BackgroundJobsList & { Item: FC } = Object.assign(BackgroundJobsList, {
  Item: BackgroundJobsListItem,
})
export { ListAndItem as BackgroundJobsList }
